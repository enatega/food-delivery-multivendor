import { useQuery } from "@apollo/client";
import React from "react";
import { AppState, AppStateStatus } from "react-native";
import TestRenderer, { act } from "react-test-renderer";

import { getStoreId } from "@/lib/services";
import RestaurantProvider from "./restaurant";

let mockAppStateListener: ((state: AppStateStatus) => void) | undefined;
const mockRemoveAppStateListener = jest.fn();

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return { ...actual, useQuery: jest.fn() };
});

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(null),
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
}));

jest.mock("@/lib/services", () => ({
  getStoreId: jest.fn(),
}));

jest.mock("@/lib/context/global/store-mode.context", () => ({
  useStoreMode: () => ({
    isSingleVendor: false,
    storeIdKey: "store-id",
  }),
}));

describe("RestaurantProvider app state reconciliation", () => {
  const refetch = jest.fn();
  const unsubscribe = jest.fn();
  const subscribeToMore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockAppStateListener = undefined;
    Object.defineProperty(AppState, "currentState", {
      configurable: true,
      value: "active",
    });
    jest.spyOn(AppState, "addEventListener").mockImplementation(
      (_event, listener) => {
        mockAppStateListener = listener;
        return { remove: mockRemoveAppStateListener };
      },
    );
    jest.mocked(getStoreId).mockResolvedValue("restaurant-1");
    refetch.mockResolvedValue({ data: { restaurantOrders: [] } });
    subscribeToMore.mockReturnValue(unsubscribe);
    jest.mocked(useQuery).mockReturnValue({
      loading: false,
      error: undefined,
      data: { restaurantOrders: [] },
      subscribeToMore,
      refetch,
      fetchMore: jest.fn(),
      networkStatus: 7,
    } as never);
  });

  afterEach(() => jest.restoreAllMocks());

  it("refetches and recreates the subscription after returning from background", async () => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(
        <RestaurantProvider.Provider>
          <></>
        </RestaurantProvider.Provider>,
      );
      await Promise.resolve();
    });

    expect(subscribeToMore).toHaveBeenCalledTimes(1);

    act(() => mockAppStateListener?.("background"));
    await act(async () => {
      mockAppStateListener?.("active");
      await Promise.resolve();
    });

    expect(refetch).toHaveBeenCalledTimes(1);
    expect(subscribeToMore).toHaveBeenCalledTimes(2);
    expect(unsubscribe).toHaveBeenCalledTimes(1);

    act(() => renderer!.unmount());
    expect(mockRemoveAppStateListener).toHaveBeenCalledTimes(1);
  });
});
