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

export default function GetHelpMain() {
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
                title: "Success",
                message: "Your support ticket has been created successfully",
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
                title: "Error",
                message: error.message || "Failed to create support ticket",
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
                title: "Validation Error",
                message: "Please select a reason for your inquiry",
                duration: 3000,
            });
            return;
        }

        if (reason === "order related" && !orderId.trim()) {
            showToast({
                type: "error",
                title: "Validation Error",
                message: "Please provide an order ID",
                duration: 3000,
            });
            return;
        }

        if (reason === "others" && !ticketTitle.trim()) {
            showToast({
                type: "error",
                title: "Validation Error",
                message: "Please provide a title for your inquiry",
                duration: 3000,
            });
            return;
        }

        if (!description.trim()) {
            showToast({
                type: "error",
                title: "Validation Error",
                message: "Please provide a description of your issue",
                duration: 3000,
            });
            return;
        }

        setIsSubmitting(true);

        // Set title based on the selected reason
        const finalTicketTitle =
            reason === "order related"
                ? `Order Issue - ${orderId}`
                : ticketTitle;

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
        { label: "Order Related", value: "order related" },
        { label: "Others", value: "others" },
    ];

    const faqItems = [
        {
            header: "Can I track my order?",
            content:
                "Yes, you can track your order in real-time from the moment it's confirmed to when it's out for delivery. You'll receive updates on the status of your order through notifications on the app.",
        },
        {
            header: "How long does delivery take?",
            content:
                "Delivery times may vary depending on factors such as the restaurant's preparation time, traffic conditions, and your location. However, we strive to deliver your order within a reasonable timeframe, typically ranging from 30 to 60 minutes.",
        },
        {
            header: "Can I cancel my order after it's been placed?",
            content:
                "Yes, you can cancel your order once it is placed. However, once the order has been prepared and sent out for delivery, you can no longer cancel the order. You may contact the restaurant directly for assistance.",
        },
        {
            header: "How can I provide feedback on my experience?",
            content:
                "You can provide feedback through the app by rating your order and leaving comments. You can also give a rating to the restaurant and leave a review.",
        },
        {
            header: "Can I order from multiple places at the same time?",
            content:
                "Unfortunately, you can’t choose from multiple restaurants within the same order. However, you can place separate orders from different restaurants at the same time.",
        },
    ];

    return (
        <div className="w-full mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="mb-6">
                    <TextComponent
                        text={`Hi ${userName} 👋`}
                        className="text-xl md:text-2xl font-bold mb-2"
                    />
                    <TextComponent
                        text="How can we help?"
                        className="text-2xl md:text-3xl font-bold"
                    />
                </div>

                <Accordion className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionTab
                            key={index}
                            header={
                                <span className="text-base md:text-lg font-medium">
                                    {item.header}
                                </span>
                            }
                        >
                            <div className="p-3">
                                <p className="text-sm md:text-base text-gray-700">
                                    {item.content}
                                </p>
                            </div>
                        </AccordionTab>
                    ))}
                </Accordion>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <TextComponent
                    text="Still need help?"
                    className="text-xl md:text-2xl font-semibold mb-4"
                />
                <p className="text-gray-600 mb-6">
                    Our support team is available to assist you with any
                    questions or issues you may have.
                </p>
                <CustomButton
                    label="Chat with a person"
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
                <div className="flex flex-col md:h-[500px] h-[450px]">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center bg-[#1a1a1a] text-white p-4">
                        <h3 className="font-medium">Support</h3>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleCloseModal}
                                className="text-white hover:text-gray-300"
                            >
                                <span className="sr-only">Close</span>✕
                            </button>
                        </div>
                    </div>

                    {/* Modal Body - Scrollable */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">
                                Hi, {userName}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Email: {userEmail}
                            </p>
                        </div>

                        {/* Reason Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                What&apos;s your issue about?
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
                                placeholder="Select a reason"
                                className="w-full"
                            />
                        </div>

                        {/* Conditional field based on reason */}
                        {reason === "order related" && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order ID
                                </label>
                                <InputText
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="Enter order ID"
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                        )}

                        {reason === "others" && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <InputText
                                    value={ticketTitle}
                                    onChange={(e) =>
                                        setTicketTitle(e.target.value)
                                    }
                                    placeholder="Enter a title for your inquiry"
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                        )}

                        {/* Description Text Area */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {reason === "order related"
                                    ? "Describe your issue with this order"
                                    : "Tell us more about your issue"}
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Please describe your issue in detail..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5AC12F]"
                            />
                        </div>
                    </div>

                    {/* Send Button - Fixed at bottom */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <button
                            onClick={handleSendMessage}
                            disabled={
                                !reason ||
                                (reason === "order related" &&
                                    !orderId.trim()) ||
                                (reason === "others" && !ticketTitle.trim()) ||
                                !description.trim() ||
                                isSubmitting
                            }
                            className={`bg-[#5AC12F] text-white w-full py-3 rounded-full flex items-center justify-center ${
                                !reason ||
                                (reason === "order related" &&
                                    !orderId.trim()) ||
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
                                <span>Send</span>
                            )}
                        </button>
                    </div>
                </div>
            </CustomDialog>
        </div>
    );
}
