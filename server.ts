import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Event Agenda Generator
  app.post("/api/generate-agenda", async (req, res) => {
    try {
      const { eventName, theme, durationDays, eventType, city, country, hours } = req.body;

      if (!eventName) {
        return res.status(400).json({ error: "Event name is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("[AI Studio] GEMINI_API_KEY is not defined. Returning a premium fallback agenda.");
        // High-quality fallback structured agenda
        return res.json(getFallbackAgenda(eventName, theme || "Event Launch", durationDays || 1, city, country));
      }

      // Initialize Gemini Client
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are a professional event coordinator and conference planner. 
Generate a comprehensive, highly professional, and structured schedule/agenda for the following event:
- Event Name: "${eventName}"
- Core Theme/Focus: "${theme || "Innovation & Growth"}"
- Event Type: "${eventType || "Conference"}"
- Duration: ${durationDays || 1} day(s)
- Location: ${city || "Lagos"}, ${country || "Nigeria"}
- Scheduled Daily Hours: "${hours || "09:00 - 17:00"}"

Since this is an African event co-pilot, weave in subtle and classy African references where appropriate (e.g., networking over local snacks like chin chin or biltong, traditional high-energy icebreakers, local industry examples, or Pan-African collaboration themes).

Produce a highly realistic schedule of timeslots. For each day, include:
1. Registration & Welcome Icebreaker (usually 30-45 mins at start)
2. Opening/Keynote speeches
3. Interactive Panels or Technical sessions
4. Lunch and networking breaks with descriptive cultural references
5. Practical afternoon workshops or breakout tracks
6. End of day wrap-up or high-energy networking evening social.

Return the agenda in a clean JSON format matching the schema exactly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite, highly detailed event planning AI. Your output must strictly match the requested JSON schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              eventName: { type: Type.STRING },
              theme: { type: Type.STRING },
              durationDays: { type: Type.INTEGER },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    slots: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          time: { type: Type.STRING, description: "Time slot range, e.g., '09:00 - 09:45'" },
                          title: { type: Type.STRING, description: "Session or activity title" },
                          speakerRole: { type: Type.STRING, description: "Primary presenter role or 'None' for breaks, e.g., 'Founding Partner', 'Sponsor Panel', 'MC & Co-Pilots'" },
                          description: { type: Type.STRING, description: "Detailed 1-2 sentence description of what the slot covers" },
                          type: { type: Type.STRING, description: "Choose from: 'Keynote', 'Panel', 'Break', 'Networking', 'Workshop', 'Interactive Session', 'Closing'" }
                        },
                        required: ["time", "title", "speakerRole", "description", "type"]
                      }
                    }
                  },
                  required: ["dayNumber", "title", "slots"]
                }
              }
            },
            required: ["eventName", "theme", "durationDays", "days"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini API.");
      }

      const agendaData = JSON.parse(responseText.trim());
      res.json(agendaData);

    } catch (error: any) {
      console.error("Error generating agenda:", error);
      res.status(500).json({ 
        error: "Failed to generate AI agenda. Please try again later.",
        details: error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

function getFallbackAgenda(eventName: string, theme: string, duration: number, city?: string, country?: string) {
  const daysArray = [];
  const loc = `${city || "Lagos"}, ${country || "Nigeria"}`;

  for (let d = 1; d <= duration; d++) {
    daysArray.push({
      dayNumber: d,
      title: `Day ${d}: Fueling Growth & African Tech Excellence`,
      slots: [
        {
          time: "08:30 - 09:30",
          title: "Registration & Warm Coffee & Chai Icebreaker",
          speakerRole: "Host Team & Welcoming MC",
          description: "Check in, print custom QR badges, and network over local treats, Kenyan tea, and Nigerian coffee.",
          type: "Networking"
        },
        {
          time: "09:30 - 10:15",
          title: `Opening Keynote: Scaling ${theme} Across Key African Hubs`,
          speakerRole: "Lead Conference Chairperson",
          description: "Setting the stage with localized insights on Pan-African market consolidation, growth rates, and structural logistics.",
          type: "Keynote"
        },
        {
          time: "10:15 - 11:30",
          title: "Panel: Raising Capital & Overcoming Infrastructure Limits",
          speakerRole: "Founding Partners & Regional VC Directors",
          description: "Engaging dialogue with cross-border investors on alternative payment channels, mobile money growth, and infrastructure solutions.",
          type: "Panel"
        },
        {
          time: "11:30 - 11:45",
          title: "Mid-Morning Hibiscus Tea & Chin Chin Refreshment Break",
          speakerRole: "None",
          description: "A quick high-energy recharge break to connect with fellow delegates and exchange contact info.",
          type: "Break"
        },
        {
          time: "11:45 - 13:00",
          title: "Technical Breakout: Designing for the Next Billion Users",
          speakerRole: "VP of Product & Engineering",
          description: "A hands-on walk-through of low-bandwidth responsive design, offline-first architectures, and mobile billing integrations.",
          type: "Workshop"
        },
        {
          time: "13:00 - 14:15",
          title: "Gourmet African Lunch & Exhibition Showcase",
          speakerRole: "None",
          description: "Enjoy classic local dishes (including Jollof rice, plantains, and grilled proteins) while viewing sponsor booths and start-up pitches.",
          type: "Break"
        },
        {
          time: "14:15 - 15:30",
          title: "Interactive Roundtable: Talent Pipeline & Remote Team Optimization",
          speakerRole: "HR Leaders & Tech Hub Founders",
          description: "Interactive session addressing local skills training, regional retention, and cross-border workspace logistics.",
          type: "Interactive Session"
        },
        {
          time: "15:30 - 16:30",
          title: `Action Plan Workshop: Realizing ${theme} in ${loc}`,
          speakerRole: "Strategy Director & Facilitators",
          description: "Interactive workshop mapping out concrete regional rollout timelines, marketing campaigns, and partner checklists.",
          type: "Workshop"
        },
        {
          time: "16:30 - 17:00",
          title: "Day Wrap-up & AI Co-Pilot Summary Action Points",
          speakerRole: "Chief Operations Co-Pilot",
          description: "Synthesizing key takeaways and detailing checklist assignments inside the Engine module for tomorrow's execution.",
          type: "Closing"
        }
      ]
    });
  }

  return {
    eventName,
    theme,
    durationDays: duration,
    days: daysArray,
    isDemoFallback: true
  };
}

startServer();
