import { useContext, useEffect, useRef, useState } from "react";

import { ApolloError, useMutation, useSubscription } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

import { ASSIGN_ORDER } from "../apollo/mutations/order.mutation";
import { SUBSCRIPTION_ORDERS } from "../apollo/subscriptions";
import UserContext from "../context/global/user.context";
import { FlashMessageComponent } from "../ui/useable-components";
import { IOrder } from "../utils/interfaces/order.interface";
import { getRemainingAcceptingTime } from "../utils/methods";

const useOrder = (order: IOrder) => {
  //   const { active } = useContext(TabsContext)
  const { refetchAssigned } = useContext(UserContext);
  const navigation = useNavigation();
  const secondsRef = useRef(0);
  const minutesRef = useRef(2);
  const timerRef = useRef<NodeJS.Timeout>();
  const [time, setTime] = useState("00:00");

  useEffect(() => {
        // Clear any existing timer first to prevent multiple timers
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = undefined;
        }

   if(order.acceptedAt){
    const remainingSeconds = getRemainingAcceptingTime(order?.acceptedAt);
    if (remainingSeconds > 0) {
      minutesRef.current = Math.floor(remainingSeconds / 60);
      secondsRef.current = remainingSeconds % 60;
      timerRef.current = setInterval(() => {
        if (secondsRef.current > 0) {
          secondsRef.current = secondsRef.current - 1;
        }
        if (secondsRef.current < 1) {
          if (minutesRef.current > 0) {
            minutesRef.current = minutesRef.current - 1;
            secondsRef.current = 59;
          } else {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = undefined;
            }
            refetchAssigned();
          }
        }
        if (secondsRef.current > 0 && secondsRef.current < 10) {
          setTime(`0${minutesRef.current}:0${secondsRef.current}`);
        } else {
          setTime(`0${minutesRef.current}:${secondsRef.current}`);
        }
      }, 1000);
    }
   }
    return () => timerRef.current && clearInterval(timerRef.current);
  }, []);

  useSubscription(SUBSCRIPTION_ORDERS, {
    variables: { id: order?._id },
    skip: !order,
  });
  const [mutateAssignOrder, { loading: loadingAssignOrder }] = useMutation(
    ASSIGN_ORDER,
    {
      onCompleted,
      onError,
      // refetchQueries: [{ query: refetchAssigned }],
    }
  );

  async function onCompleted(result) {
    if (result.assignOrder) {
      FlashMessageComponent({ message: "Order has been assigned to you." });
    }
  }

  function onError({ graphQLErrors, networkError }:ApolloError) {
    let message = "Unknown error occured";
    if (networkError) message = "Internal Server Error";
    if (graphQLErrors) message = graphQLErrors.map((o) => o.message).join(", ");

    FlashMessageComponent({ message: message });
  }

  return {
    // active,
    navigation,
    time,
    mutateAssignOrder,
    loadingAssignOrder,
  };
};

export default useOrder;
