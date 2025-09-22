"use client";

import { useState } from "react";
import TextComponent from "@/lib/ui/useable-components/text-field";
import CustomButton from "@/lib/ui/useable-components/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/lib/api/graphql";
import { CREATE_SUPPORT_TICKET } from "@/lib/api/graphql/mutations/SupportTickets";
import useToast from "@/lib/hooks/useToast";
import { useRouter } from "next/navigation";
import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";
import { useTranslations } from "next-intl";

export default function GetHelpMain() {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [ticketTitle, setTicketTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Get user profile data
  const { data: profileData } = useQuery(GET_USER_PROFILE, {
    fetchPolicy: "cache-and-network",
  });

  const userName = profileData?.profile?.name || "User";
  const userEmail = profileData?.profile?.email || "N/A";

  // Setup toast notification
  const { showToast } = useToast();

  // Setup mutation for creating a support ticket
  const [createSupportTicket] = useMutation(CREATE_SUPPORT_TICKET, {
    onCompleted: () => {
      setIsSubmitting(false);
      showToast({
        type: "success",
        title: t("toast_success"),
        message: t("support_ticket_created_successfully"),
        duration: 3000,
      });
      handleCloseModal();
      // Redirect to the tickets page after successful creation
      router.push("/profile/customerTicket");
    },
    onError: (error) => {
      setIsSubmitting(false);
      console.error("Mutation error:", error);
      showToast({
        type: "error",
        title: t("toast_error"),
        message: t("title_is_not_allowed_to_be_empty"),
        duration: 3000,
      });
    },
  });

  const handleChatWithPerson = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReason(null);
    setOrderId("");
    setTicketTitle("");
    setDescription("");
  };

  const handleSendMessage = useDebounceFunction(() => {
    // Validate form data
    if (!reason) {
      showToast({
        type: "error",
        title: t("validation_error_title"),
        message: t("select_reason_for_inquiry"),
        duration: 3000,
      });
      return;
    }

    if (reason === "order related" && !orderId.trim()) {
      showToast({
        type: "error",
        title: t("validation_error_title"),
        message: t("provide_order_id"),
        duration: 3000,
      });
      return;
    }

    if (reason === "others" && !ticketTitle.trim()) {
      showToast({
        type: "error",
        title: "validation_error_title",
        message: t("provide_title_for_inquiry"),
        duration: 3000,
      });
      return;
    }

    if (!description.trim()) {
      showToast({
        type: "error",
        title: "validation_error_title",
        message: t("provide_description_of_issue"),
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    // Set title based on the selected reason
    const finalTicketTitle =
      reason === "order related" ? `Order Issue - ${orderId}` : ticketTitle;

    // Include order ID in description if order-related
    const ticketDescription =
      reason === "order related"
        ? `Order ID: ${orderId}\n\n${description}`
        : description;

    // Prepare variables object based on the selected reason
    const ticketInput = {
      title: finalTicketTitle,
      description: ticketDescription,
      category: reason,
      userType: "User",
    };

    // Add orderId only for order_related category
    if (reason === "order related") {
      // @ts-ignore - Adding dynamic property
      ticketInput.orderId = orderId;
    } else {
      // Add otherDetails only for others category
      // @ts-ignore - Adding dynamic property
      ticketInput.otherDetails = ticketTitle;
    }

    // Create the support ticket
    createSupportTicket({
      variables: {
        ticketInput,
      },
    });
  }, 500);

  // Simplified reason options - matching exact values from API
 const reasonOptions = [
  { label: t("order_related_label"), value: "order related" },
  { label: t("others_label"), value: "others" },
];

  const faqItems = [
    {
      header: t("faq_track_order_header"),
      content: t("faq_track_order_content"),
    },
    {
      header: t("faq_delivery_time_header"),
      content: t("faq_delivery_time_content"),
    },
    {
      header: t("faq_cancel_order_header"),
      content: t("faq_cancel_order_content"),
    },
    {
      header: t("faq_feedback_header"),
      content: t("faq_feedback_content"),
    },
    {
      header: t("faq_multiple_places_header"),
      content: t("faq_multiple_places_content"),
    },
  ];

  return (
    <div className="w-full mx-auto">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm mb-6">
        <div className="mb-6">
          <TextComponent
            text={` ${t("hi_label")} ${userName} 👋`}
            className="text-xl md:text-2xl font-bold mb-2 dark:text-gray-100"
          />
          <TextComponent
            text={t("how_can_we_help_label")}
            className="text-2xl md:text-3xl font-bold dark:text-gray-100"
          />
        </div>

        <Accordion
          className="w-full"
          pt={{
            root: { className: "dark:bg-gray-800 dark:text-white rounded-lg" }, // outer container
          }}
        >
          {faqItems.map((item, index) => (
            <AccordionTab
              key={index}
              header={
                <span className="text-base md:text-lg font-medium dark:text-gray-200">
                  {item.header}
                </span>
              }
              pt={{
                header: { className: "dark:bg-gray-800" }, // wrapper of the clickable header
                headerAction: {
                  className:
                    "  dark:bg-gray-800 dark:white dark:hover:bg-gray-700 focus:outline-none focus:ring-0",
                }, // the clickable element
                headerIcon: { className: "dark:text-white" }, // chevron icon color
                content: { className: "dark:bg-gray-800 dark:text-gray-200" }, // content panel
              }}
            >
              <div className="p-3">
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-200">
                  {item.content}
                </p>
              </div>
            </AccordionTab>
          ))}
        </Accordion>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
        <TextComponent
          text={t("still_need_help_label")}
          className="text-xl md:text-2xl font-semibold mb-4 dark:text-gray-200"
        />
        <p className="text-gray-600 mb-6 dark:text-gray-200">
          {t("support_team_available_message")}
        </p>
        <CustomButton
          label={t("chat_with_person_button")}
          onClick={handleChatWithPerson}
          className="bg-[#5AC12F] text-white px-6 py-3 rounded-full"
        />
      </div>

      {/* Support Modal - Responsive positioning */}
      <CustomDialog
        visible={isModalOpen}
        onHide={handleCloseModal}
        width="450px"
        className="support-modal md:fixed md:bottom-4 md:right-4 md:shadow-xl"
      >
        <div className="flex flex-col md:h-[500px] h-[450px] dark:bg-gray-900 dark:text-gray-100">
          {/* Modal Header */}
          <div className="flex justify-between items-center bg-[#1a1a1a] text-white p-4">
            <h3 className="font-medium"> {t("support_modal_title")} </h3>
            <div className="flex items-center space-x-2">
              {/* <button
                onClick={handleCloseModal}
                className="text-white hover:text-gray-300"
              >
                <span className="sr-only">{t("close_label")}</span>✕
              </button> */}
            </div>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t("hi_label")}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("email_label")}: {userEmail}
              </p>
            </div>

            {/* Reason Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("whats_your_issue_about_label")}
              </label>
              <Dropdown
                value={reason}
                onChange={(e: DropdownChangeEvent) => {
                  setReason(e.value);
                  // Reset order ID when changing reason type
                  if (e.value !== "order related") {
                    setOrderId("");
                  }
                }}
                options={reasonOptions}
                placeholder={t("select_reason_placeholder")}
                className="w-full dark:bg-gray-800 border border-gray-300 dark:border-gray-700 "
                panelClassName="
                dark:bg-gray-800  dark:border-gray-700
                [&_.p-dropdown-item]:dark:bg-gray-800 
                [&_.p-dropdown-item]:dark:text-white
                [&_.p-dropdown-item:hover]:dark:!bg-gray-700 
                [&_.p-dropdown-item:hover]:dark:!text-white
                [&_.p-dropdown-item.p-highlight]:dark:!bg-gray-700 
              "
              />
            </div>

            {/* Conditional field based on reason */}
            {reason === "order related" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("order_id_label")}
                </label>
                <InputText
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder={t("enter_order_id_placeholder")}
                  className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            )}

            {reason === "others" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("title_label")}
                </label>
                <InputText
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder={t("enter_title_for_inquiry_placeholder")}
                  className="w-full p-3 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            )}

            {/* Description Text Area */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300  mb-1">
                {reason === "order related"
                  ? t("describe_issue_with_order_label")
                  : t("tell_us_more_about_issue_label")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder={t("describe_issue_in_detail_placeholder")}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5AC12F]"
              />
            </div>
          </div>

          {/* Send Button - Fixed at bottom */}
          <div className="p-4 border-t border-gray-200 bg-white dark:bg-gray-900">
            <button
              onClick={handleSendMessage}
              disabled={
                !reason ||
                (reason === "order related" && !orderId.trim()) ||
                (reason === "others" && !ticketTitle.trim()) ||
                !description.trim() ||
                isSubmitting
              }
              className={`bg-[#5AC12F] text-white w-full py-3 rounded-full flex items-center justify-center ${
                !reason ||
                (reason === "order related" && !orderId.trim()) ||
                (reason === "others" && !ticketTitle.trim()) ||
                !description.trim() ||
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#4CAF27]"
              }`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>{t("send_button")}</span>
              )}
            </button>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
}
