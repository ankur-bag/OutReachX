# OutreachX - AI-Powered Campaign Automation Platform

OutreachX is a first-of-its-kind digital campaign automation system that empowers users to launch multi-channel outreach campaigns in just one click. Built with Next.js, Firebase, and Google AI, it combines intelligent content generation with real-time messaging capabilities to revolutionize how organizations connect with their audiences.

## 🎯 What is OutreachX?

OutreachX eliminates the complexity of managing multi-channel campaigns by providing an intuitive, AI-assisted platform that handles everything from content creation to real-time engagement. Whether you're a marketing team, educational institution, or outreach organization, OutreachX streamlines your communication workflow.

### Core Capabilities:

✅ Create AI-enhanced campaigns with auto-generated descriptions
✅ Support multi-channel delivery: Text, Voice Messages (WhatsApp), and Automated Calls
✅ Upload and manage contacts via CSV/Excel files
✅ Generate professional TTS audio with customizable voices and tones
✅ Manage conversations with a WhatsApp-like inbox interface
✅ Track analytics with real-time engagement metrics
✅ Leverage AI for smarter messaging and content refinement

## 🚀 Key Features

### 1. Intelligent Campaign Creation (7-Step Wizard)

OutreachX guides users through a comprehensive campaign setup process:

- **Title**: Name and brand your campaign
- **Description**: Input campaign details with AI enhancement suggestions
- **Channels**: Choose delivery methods (Text, Voice, Calls)
- **Assets**: Upload images, videos, and multimedia content
- **Documents**: Upload PDFs for AI context and knowledge base
- **Contacts**: Import contact lists from CSV/Excel files
- **Preview**: Review all campaign details before launch

The platform uses Google Gemini AI to enhance descriptions, making them more compelling and engagement-focused while maintaining your core message.

### 2. Multi-Channel Delivery System

Send campaigns across multiple channels simultaneously:

**Text Messages**: WhatsApp-compatible SMS-style messages with full formatting support

**Voice Messages**: AI-generated TTS audio using Google Gemini's advanced text-to-speech, with:
- Multiple voice options (friendly, formal, casual, energetic)
- Tone-based voice selection
- Natural-sounding delivery
- Professional audio quality

**Automated Calls**: Scripted phone calls that can be customized per contact with voice personalization

**Asset Embedding**: All channels support rich media including images, videos, and document references

### 3. WhatsApp-Like Inbox Interface

A modern, familiar chat interface that mirrors WhatsApp's user experience:

- **Real-time messaging**: Send and receive messages instantly
- **Contact management**: Organize contacts with search and filtering
- **Audio playback**: Built-in player with waveform visualization, progress tracking, and playback controls
- **Asset gallery**: View and interact with images and videos sent in campaigns
- **Unread indicators**: Track conversation status with visual badges
- **Message history**: Complete conversation timeline with timestamps
- **Optimistic updates**: Instant message reflection before server confirmation

### 4. AI-Powered Content Generation

OutreachX leverages Google Gemini 2.5-Flash for intelligent content creation:

**Description Enhancement**: Automatically refine campaign descriptions to be more persuasive, action-oriented, and engaging while maintaining your core message and staying within word limits

**Voice Script Generation**: Convert descriptions into natural-sounding voice scripts optimized for TTS with proper pacing and pronunciation

**Text Variations**: Generate multiple message variations for A/B testing and personalization

**Context Awareness**: PDFs and documents uploaded during campaign creation inform AI responses, creating a knowledge base for answering contact questions

**Tone Adaptation**: Messages automatically adjust based on selected tone (professional, friendly, casual, energetic)

### 5. Contact Management & Segmentation

Upload and manage contacts with intelligent processing:

- **Bulk import**: CSV/Excel support with automatic field mapping
- **Data validation**: Phone number and email verification
- **Field mapping**: Automatically detect name, email, phone, and custom fields
- **Deduplication**: Remove duplicate contacts automatically
- **Status tracking**: Monitor contact engagement status (reached, replied, unresponsive, etc.)
- **Personalization**: Use contact data in dynamic message templates

### 6. Real-Time Analytics Dashboard

Monitor campaign performance with comprehensive metrics:

- **Engagement tracking**: View total contacts reached, message open rates, and reply statistics
- **Response analytics**: Track AI-powered responses and user interactions
- **Contact breakdown**: Visualize contact status distribution across campaigns
- **Channel performance**: Compare effectiveness across text, voice, and call channels
- **Time-based insights**: Track engagement patterns over time
- **Conversion metrics**: Monitor campaign goals and KPIs

## 💡 How It Works

### Campaign Creation Flow

1. User logs in via Clerk authentication
2. Completes onboarding to define business type, audience, and brand style
3. Follows the 7-step campaign wizard, filling in campaign details
4. AI enhances descriptions and generates voice transcripts
5. System generates TTS audio and uploads to cloud storage
6. User uploads contact list
7. Reviews campaign preview with all assets
8. Launches campaign with one click

### Campaign Execution

1. Campaign is persisted to Firestore with all details and media
2. Contact list is processed and stored
3. Inbox structure is created for each contact
4. Messages are auto-generated from campaign content
5. Users can access the inbox to view conversations
6. Real-time messaging between organization and contacts
7. AI responds to contact inquiries based on campaign context
8. Analytics are updated in real-time

### Inbox Messaging

1. User navigates to launched campaign in inbox
2. Selects a contact from the list
3. Views conversation history with campaign messages
4. Can listen to audio messages with interactive player
5. Can view attached images and videos
6. Types and sends custom responses
7. AI automatically responds based on campaign knowledge
8. All messages are logged for analytics

## 🎨 Technology Stack

### Frontend & Framework

- Next.js 15 with React and TypeScript
- Tailwind CSS for styling
- shadcn/ui components for consistency
- Lucide icons for visual elements
- Framer Motion for animations

### Authentication

- Clerk for secure user authentication
- Role-based access control
- Session management

### Backend & Database

- Firebase Firestore for document storage
- Firebase Storage for file management
- Next.js API routes for backend logic
- Firebase Admin SDK for server-side operations

### AI & Content Generation

- Google Gemini 2.5-Flash for content enhancement and analysis
- Google Gemini Text-to-Speech for audio generation
- LangChain for conversational AI (ready for integration)

### File Storage & CDN

- Cloudinary for image, video, and audio hosting
- Secure URLs with authentication
- Automatic optimization

### Real-Time Features

- WebSocket-ready architecture
- Optimistic UI updates
- Real-time Firestore subscriptions

## 📊 Data Architecture

### Campaign Structure

Campaigns are stored hierarchically in Firestore:

- Campaign metadata (title, description, channels, etc.)
- Asset references (images, videos, documents)
- Contact list with personalization data
- Channel-specific content (voice transcripts, call scripts)
- Generated audio URLs and media references
- Launch timestamp and status

### Inbox Structure

Each campaign maintains an inbox for contact conversations:

- Message collection per contact
- System-generated campaign messages (title, description, voice, assets)
- User-sent messages with timestamps
- AI-generated responses
- Read/unread status tracking

### User Profile

Onboarding information stored to personalize AI:

- Business type and target audience
- Brand style preferences
- Response preference (short, balanced, detailed)
- Compliance and safety guidelines
- Terms acceptance and legal agreements

## 🔐 Security & Compliance

### Authentication & Authorization

- Clerk handles all authentication
- Protected API routes verify user ownership
- Firestore security rules enforce data isolation
- Session-based access control

### Data Protection

- User data isolated by Clerk user ID
- Campaign data only accessible to campaign owner
- Contact information encrypted in transit
- Secure file uploads with validation

### Legal Compliance

- Terms of service require legal consent confirmation
- Users must acknowledge responsibility for regulatory compliance
- No contact without legal basis
- GDPR-ready architecture
- WhatsApp, telecom, and data protection law compliance notes

**Important**: Users are solely responsible for:

- Obtaining proper consent from all contact recipients
- Complying with WhatsApp's Business API terms
- Following telecom regulations in their jurisdiction
- Adhering to data protection laws (GDPR, CCPA, etc.)
- Ensuring lawful use of automated messaging

## 🎯 Use Cases

### Marketing Teams

Launch multi-channel campaigns to promote products, services, or events. Use AI to personalize messages at scale and track engagement.

### Educational Institutions

Reach students and parents with updates, announcements, and notifications across their preferred channels. Provide instant support through the inbox.

### Non-Profit Organizations

Conduct outreach campaigns, fundraising initiatives, and awareness programs with minimal manual effort. Track supporter engagement over time.

### E-Commerce Businesses

Send product announcements, order updates, and customer support messages through multiple channels. Monitor customer responses and feedback.

### Customer Support Teams

Manage customer inquiries through a unified inbox interface. Use AI to provide instant responses based on knowledge base documents.

---

**Built with ❤️ for modern outreach teams**
