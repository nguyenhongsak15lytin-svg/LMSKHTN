import { GoogleGenAI } from '@google/genai';

// Initialize Gemini SDK with runtime API key
const apiKey = typeof process !== 'undefined' && process.env?.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : '';
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export async function generateAILessonContent(topic: string, level: string): Promise<{ title: string; content: string }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Hãy soạn một bài giảng chi tiết bằng tiếng Việt về chủ đề "${topic}" dành cho trình độ ${level}. 
      Bao gồm:
      1. Tiêu đề hấp dẫn
      2. Nội dung bài giảng định dạng Markdown có cấu trúc rõ ràng (Giới thiệu, Nội dung trọng tâm, Ví dụ thực tế, Bài tập nhỏ).
      Hãy trả về kết quả thuần túy dưới dạng JSON có cấu trúc: { "title": "...", "content": "..." }`,
    });

    const text = response.text || '';
    // Try to extract json block
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      title: `Bài giảng: ${topic}`,
      content: text || 'Không thể tạo nội dung.'
    };
  } catch (err) {
    console.error('Gemini AI error:', err);
    return {
      title: `Bài giảng: ${topic}`,
      content: `# ${topic}\n\n(Nội dung tự động tạo ngoại tuyến hoặc do lỗi kết nối AI)\n\n- Khái niệm cơ bản\n- Ứng dụng thực tế\n- Bài tập thực hành`
    };
  }
}

export async function askAIStudyBuddy(question: string, contextLesson?: string): Promise<string> {
  try {
    const prompt = contextLesson 
      ? `Dựa trên bài học "${contextLesson}", hãy giải đáp thắc mắc sau của học sinh một cách dễ hiểu, thân thiện bằng tiếng Việt: "${question}"`
      : `Hãy giải đáp thắc mắc học tập sau của học sinh một cách dễ hiểu, thân thiện bằng tiếng Việt: "${question}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'Xin lỗi, trợ lý AI hiện không thể phản hồi.';
  } catch (err) {
    console.error('Gemini AI study buddy error:', err);
    return 'Xin lỗi, đã xảy ra lỗi kết nối với trợ lý AI. Bạn hãy thử lại sau nhé!';
  }
}
