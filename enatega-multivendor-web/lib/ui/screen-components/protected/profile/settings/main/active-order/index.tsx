// "use client";
// import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
// import CustomButton from "@/lib/ui/useable-components/button";
// import { useTranslations } from "next-intl";
// import { FiLoader } from "react-icons/fi";

// interface ActiveOrderDialogProps {
//   visible: boolean;
//   onHide: () => void;
//   isOrdersLoading: boolean;
//   hasNoActiveOrders: boolean;
//   activeOrdersCount: number;
//   onContinue: () => void;
// }

// export default function ActiveOrderDialog({
//   visible,
//   onHide,
//   isOrdersLoading,
//   hasNoActiveOrders,
//   activeOrdersCount,
//   onContinue,
// }: ActiveOrderDialogProps) {
//   const t = useTranslations();

//   return (
//     <CustomDialog
//       visible={visible}
//       onHide={onHide}
//       width="480px"
//       className="active-order-dialog"
//     >
//       <div className="p-6 flex flex-col items-center text-center transition-all duration-200">
//         {/* Title */}
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//           {isOrdersLoading
//             ? t("checking_for_active_orders", {
//                 defaultValue: "Checking for Active Orders",
//               })
//             : hasNoActiveOrders
//               ? t("no_active_orders_found", {
//                   defaultValue: "No Active Orders Found",
//                 })
//               : t("active_orders_found", {
//                   defaultValue: "Active Orders Found",
//                 })}
//         </h2>

//         {/* Content */}
//         {isOrdersLoading ? (
//           <div className="flex flex-col items-center py-4">
//             <FiLoader className="w-8 h-8 text-green-500 animate-spin mb-4" />
//             <p className="text-gray-600 dark:text-gray-300 text-lg">
//               {t("checking_active_orders_message", {
//                 defaultValue:
//                   "Please wait while we check your active orders...",
//               })}
//             </p>
//           </div>
//         ) : hasNoActiveOrders ? (
//           <div className="py-2">
//             <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
//               {t("no_active_orders_delete_allowed", {
//                 defaultValue:
//                   "You currently have no active orders. You can continue to delete your account.",
//               })}
//             </p>
//             <div className="flex w-full gap-4 mt-2">
//               <CustomButton
//                 label={t("cancel", { defaultValue: "Cancel" })}
//                 onClick={onHide}
//                 className="flex-1 py-3 border border-gray-500 rounded-full bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
//               />
//               <CustomButton
//                 label={t("continue", { defaultValue: "Continue" })}
//                 onClick={onContinue}
//                 className="flex-1 py-3 rounded-full bg-[#5AC12F] text-white hover:bg-[#54ad2d]"
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="py-2">
//             <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
//               <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
//                 {t("you_currently_have")} {activeOrdersCount} {t("active")}{" "}
//                 {activeOrdersCount === 1 ? t("order") : t("orders")}.{" "}
//                 {t("you_can_only_delete_account")}
//               </p>
//             </p>
//             <CustomButton
//               label={t("OK", { defaultValue: "OK" })}
//               onClick={onHide}
//               className="w-full py-3 rounded-full bg-[#5AC12F] text-white hover:bg-[#54ad2d] "
//             />
//           </div>
//         )}
//       </div>
//     </CustomDialog>
//   );
// }
