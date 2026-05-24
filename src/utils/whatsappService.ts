import axios from 'axios';

interface WhatsAppMessage {
    phone: string;
    message: string;
}

export class WhatsAppService {
    private apiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send';
    private phoneNumber = process.env.WHATSAPP_PHONE_NUMBER || '';

    // Send booking confirmation via WhatsApp
    async sendBookingConfirmation(phone: string, bookingDetails: any): Promise<boolean> {
        const message = `
Hello ${bookingDetails.customerName}! 🚗

Your booking request for ${bookingDetails.carName} has been received!

📅 Pickup: ${new Date(bookingDetails.pickupDate).toLocaleDateString()}
📅 Drop: ${new Date(bookingDetails.dropDate).toLocaleDateString()}
💰 Total Price: ₹${bookingDetails.totalPrice}
📍 Pickup: ${bookingDetails.pickupLocation}

Booking Status: ${bookingDetails.status}

We will confirm your booking shortly. Thank you for choosing SWAG Wheels! 🎉

Team SWAG Wheels
+91 88278 14985
    `.trim();

        return await this.sendMessage(phone, message);
    }

    // Send contact query response via WhatsApp
    async sendContactQueryResponse(phone: string, name: string, queryType: string): Promise<boolean> {
        const message = `
Hi ${name}! 👋

Thank you for contacting SWAG Wheels. We received your ${queryType} query.

Our team will get back to you within 24 hours. 

For immediate assistance, call us at: +91 88278 14985

Best regards,
Team SWAG Wheels 🚗
    `.trim();

        return await this.sendMessage(phone, message);
    }

    // Send professional booking message with details
    async sendDetailedBookingMessage(
        phone: string,
        bookingDetails: any
    ): Promise<boolean> {
        const message = `
*SWAG WHEELS - Booking Confirmation* ✅

*Customer Details:*
Name: ${bookingDetails.customerName}
Phone: ${bookingDetails.customerPhone}
Email: ${bookingDetails.customerEmail}

*Car Details:*
${bookingDetails.carName}

*Rental Details:*
Pickup: ${new Date(bookingDetails.pickupDate).toLocaleDateString('en-IN')}
Drop: ${new Date(bookingDetails.dropDate).toLocaleDateString('en-IN')}
Duration: ${bookingDetails.totalDays} days
Rate: ₹${bookingDetails.pricePerDay}/day

*Total Amount: ₹${bookingDetails.totalPrice}*

*Pickup Location:* ${bookingDetails.pickupLocation}
*Drop Location:* ${bookingDetails.dropLocation}

Special Requests: ${bookingDetails.specialRequests || 'None'}

*Status:* ${bookingDetails.status.toUpperCase()}

We will contact you shortly to confirm.

Thank you for choosing SWAG Wheels! 🎉

Contact: +91 88278 14985
Website: swagwheels.com
    `.trim();

        return await this.sendMessage(phone, message);
    }

    // Generic send message method
    private async sendMessage(phone: string, message: string): Promise<boolean> {
        try {
            // Format phone number (add country code if not present)
            const formattedPhone = this.formatPhone(phone);

            // WhatsApp API endpoint (using WhatsApp Business API format)
            // This requires WhatsApp Business Account integration
            // For development, you can use WhatsApp Web automation or Twilio

            // Using standard WhatsApp API format
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

            // Log the URL for manual sending or webhook integration
            console.log('WhatsApp Message URL:', whatsappUrl);
            console.log('Phone:', formattedPhone);
            console.log('Message:', message);

            // For production, integrate with:
            // 1. WhatsApp Business API
            // 2. Twilio WhatsApp API
            // 3. Custom WhatsApp integration

            // Try Twilio integration if credentials available
            if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
                return await this.sendViaTwilio(formattedPhone, message);
            }

            // Default: return success (manual verification needed)
            return true;
        } catch (error) {
            console.error('WhatsApp send error:', error);
            return false;
        }
    }

    // Twilio WhatsApp integration
    private async sendViaTwilio(phone: string, message: string): Promise<boolean> {
        try {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

            const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

            const response = await axios.post(
                url,
                {
                    From: fromNumber,
                    To: `whatsapp:${phone}`,
                    Body: message,
                },
                {
                    auth: {
                        username: accountSid!,
                        password: authToken!,
                    },
                }
            );

            return response.status === 201;
        } catch (error) {
            console.error('Twilio error:', error);
            return false;
        }
    }

    // Format phone number to international format
    private formatPhone(phone: string): string {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');

        // If already has country code, keep it
        if (cleaned.startsWith('91')) {
            return cleaned;
        }

        // If 10 digits (India), add 91 prefix
        if (cleaned.length === 10) {
            return `91${cleaned}`;
        }

        // If already formatted with +, remove it
        return cleaned;
    }

    // Send admin notification for new booking
    async notifyAdminNewBooking(bookingDetails: any): Promise<boolean> {
        const adminPhone = process.env.ADMIN_WHATSAPP_PHONE || process.env.WHATSAPP_PHONE_NUMBER;

        if (!adminPhone) return false;

        const message = `
*NEW BOOKING RECEIVED* 🎯

Customer: ${bookingDetails.customerName}
Phone: ${bookingDetails.customerPhone}
Car: ${bookingDetails.carName}

Pickup: ${new Date(bookingDetails.pickupDate).toLocaleDateString()}
Drop: ${new Date(bookingDetails.dropDate).toLocaleDateString()}
Days: ${bookingDetails.totalDays}

Amount: ₹${bookingDetails.totalPrice}
Status: ${bookingDetails.status}

Check admin panel for full details.
    `.trim();

        return await this.sendMessage(adminPhone, message);
    }

    // Send admin notification for new contact query
    async notifyAdminNewQuery(queryDetails: any): Promise<boolean> {
        const adminPhone = process.env.ADMIN_WHATSAPP_PHONE || process.env.WHATSAPP_PHONE_NUMBER;

        if (!adminPhone) return false;

        const message = `
*NEW CONTACT QUERY* 📬

Name: ${queryDetails.name}
Phone: ${queryDetails.phone}
Email: ${queryDetails.email}

Subject: ${queryDetails.subject}

Message: ${queryDetails.message}

Check admin panel to reply.
    `.trim();

        return await this.sendMessage(adminPhone, message);
    }
}

export default new WhatsAppService();
