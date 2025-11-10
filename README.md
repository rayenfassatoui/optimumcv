# OptimumCV 📄✨

> AI-powered CV builder that helps you create, enhance, and tailor professional resumes in minutes.

## 🌟 Features

- **Import CV** - Upload existing resumes and automatically parse them into structured format
- **AI Enhancement** - Polish your professional summary with AI-powered suggestions
- **Job Adaptation** - Tailor your CV to specific job descriptions automatically
- **Professional Photo Generation** - Upload your photo and let AI generate a professional headshot
- **Real-time Preview** - See changes to your CV instantly
- **Modern UI** - Clean, professional interface with dark/light mode support
- **Form Validation** - Smart validation to ensure your CV is complete and error-free

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod validation
- **AI Integration**: Google Gemini AI
- **PDF Parsing**: PDF.js
- **State Management**: React hooks

## 📦 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Google Gemini API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rayenfassatoui/optimumcv.git
cd optimumcv
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Create a `.env` file in the root directory:
```env
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
```

> **Note**: 
> - **CV Text Features**: Powered by Gemini AI (free tier works perfectly!)
>   - CV import with AI parsing
>   - Professional summary enhancement
>   - Job description adaptation
> - **Photo Enhancement**: Uses browser-side filters (no API needed!)
>   - Applies professional brightness, contrast, and color adjustments
>   - Works offline, no quota limits
>   - Instant results

4. Run the development server:
```bash
bun dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

1. **Import a CV**: Click "Import CV" to upload an existing resume (PDF or paste text)
2. **Upload Photo**: Click "Upload Photo" to add your profile picture
3. **Enhance Photo**: Click "Enhance Photo" to generate a professional headshot (AI analyzes and enhances your photo)
4. **Fill in Details**: Complete or edit your personal information, experience, education, projects, and skills
5. **AI Enhance**: Use "AI Enhance" to improve your professional summary
6. **Adapt to Job**: Paste a job description and click "Adapt to Job" to tailor your CV
7. **Preview**: View your CV in real-time on the right panel

### Professional Photo Enhancement

The photo enhancement feature uses browser-side image processing for instant results:

**How it works:**
1. Upload your photo (any format)
2. Click "Enhance Photo"
3. Professional filters are applied instantly:
   - Brightness boost (+10%)
   - Contrast enhancement (+20%)
   - Color saturation adjustment (-15% for corporate look)
   - High-quality output

**Benefits:**
- ⚡ Instant results (no API calls)
- 🆓 Completely free (no quota limits)
- 🔒 Privacy-friendly (processed in your browser)
- 💾 Works offline

**Tips for best results:**
- Use a clear, well-lit photo
- Face should be clearly visible
- Photo will look more professional and polished
- Works with any photo style

## 📁 Project Structure

```
optimumcv/
├── app/
│   ├── api/
│   │   └── ai/           # AI enhancement endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── cv/
│   │   ├── cv-builder.tsx    # Main CV builder component
│   │   ├── cv-preview.tsx    # CV preview component
│   │   └── builder/          # Form sections
│   └── ui/               # Reusable UI components
├── lib/
│   ├── cv.ts            # CV data types and schemas
│   ├── pdf-parser.ts    # PDF parsing utilities
│   └── ai/              # AI integration
└── public/              # Static assets
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key for AI text features (CV import, enhancement, adaptation) | Yes |

### Getting API Key

**Google Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GOOGLE_GENAI_API_KEY`

This API key powers the text AI features:
- CV parsing and import
- Professional summary enhancement
- Job description adaptation

Photo enhancement runs in your browser and doesn't need any API key!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Rayen Fassatoui**
- GitHub: [@rayenfassatoui](https://github.com/rayenfassatoui)
- LinkedIn: [rayenfassatoui](https://linkedin.com/in/rayenfassatoui)
- Website: [rayenft.dev](https://rayenft.dev)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Radix UI](https://radix-ui.com)
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Icons from [Lucide](https://lucide.dev)

---

Made with ❤️ by Rayen FassatouiThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
