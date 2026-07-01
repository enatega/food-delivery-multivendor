import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { OWNER_SESSION } from '@/lib/api/graphql';
import { ILoginResponse, IOwnerSessionDataResponse } from '@/lib/utils/interfaces';
import {
  clearStoredSessionState,
  getAccessToken,
  getStoredUser,
  persistUserSession,
} from '@/lib/utils/methods/auth';

interface IUserContext {
  user: ILoginResponse | null;
  loading: boolean;
  isSessionVerified: boolean;
  setUser: (user: ILoginResponse | null) => void;
  clearUserSession: () => void;
  refreshUserSession: (
    cachedUser?: ILoginResponse | null
  ) => Promise<ILoginResponse | null>;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

const mergeRestaurants = (
  verifiedRestaurants: ILoginResponse['restaurants'] = [],
  cachedRestaurants: ILoginResponse['restaurants'] = []
) => {
  return verifiedRestaurants.map((restaurant) => {
    const cachedRestaurant = cachedRestaurants.find(
      (item) => item._id === restaurant._id
    );

    return {
      ...cachedRestaurant,
      ...restaurant,
    };
  });
};

const normalizeOwnerSession = (
  sessionUser: ILoginResponse,
  cachedUser: ILoginResponse | null
): ILoginResponse => ({
  ...cachedUser,
  ...sessionUser,
  permissions: sessionUser.permissions ?? [],
  restaurants: mergeRestaurants(
    sessionUser.restaurants ?? [],
    cachedUser?.restaurants ?? []
  ),
  shopType: cachedUser?.shopType ?? '',
});

const isAuthFailure = (error: unknown): boolean => {
  const graphQLErrors =
    typeof error === 'object' && error !== null && 'graphQLErrors' in error
      ? (error.graphQLErrors as Array<{ extensions?: { code?: string } }>)
      : [];

  return graphQLErrors.some((graphQLError) =>
    ['UNAUTHENTICATED', 'FORBIDDEN', 'TOKEN_EXPIRED', 'INVALID_TOKEN'].includes(
      graphQLError.extensions?.code ?? ''
    )
  );
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const apolloClient = useApolloClient();
  const [user, setUser] = useState<ILoginResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionVerified, setIsSessionVerified] = useState(false);

  const clearUserSession = useCallback(() => {
    clearStoredSessionState();
    setUser(null);
    setIsSessionVerified(false);
  }, []);

  const refreshUserSession = useCallback(
    async (
      cachedUser: ILoginResponse | null = getStoredUser()
    ): Promise<ILoginResponse | null> => {
      const accessToken = getAccessToken() || cachedUser?.token;

      if (!accessToken) {
        clearUserSession();
        return null;
      }

      try {
        const { data } = await apolloClient.query<IOwnerSessionDataResponse>({
          query: OWNER_SESSION,
          fetchPolicy: 'network-only',
        });

        if (!data?.ownerSession) {
          clearUserSession();
          return null;
        }

        const verifiedUser = normalizeOwnerSession(data.ownerSession, cachedUser);
        persistUserSession(verifiedUser);
        setUser(verifiedUser);
        setIsSessionVerified(true);

        return verifiedUser;
      } catch (error) {
        if (isAuthFailure(error)) {
          clearUserSession();
        } else {
          setIsSessionVerified(false);
        }

        return null;
      }
    },
    [apolloClient, clearUserSession]
  );

  useEffect(() => {
    const cachedUser = getStoredUser();
    setUser(cachedUser);

    let isMounted = true;

    const bootstrapSession = async () => {
      await refreshUserSession(cachedUser);

      if (isMounted) {
        setLoading(false);
      }
    };

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [refreshUserSession]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isSessionVerified,
        setUser,
        clearUserSession,
        refreshUserSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
