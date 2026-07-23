import PDFDocument from "pdfkit"

const cleanText = (val) => {
  if (val === undefined || val === null) return "";
  
  let str = "";
  if (typeof val === "object") {
    str = val.point || val.question || val.text || val.content || JSON.stringify(val);
  } else {
    str = String(val);
  }

  // Remove markdown characters and header signs
  str = str.replace(/[#*`]/g, "");

  // Safe emoji / special char replacement for standard Helvetica
  str = str.replace(/⭐/g, "*")
           .replace(/•/g, "-")
           .replace(/[^\x00-\x7F]/g, ""); // Strip any non-ASCII characters that Helvetica cannot render

  return str.trim();
};

export const pdfDownload = async (req,res) => {
  try {
    const {result} = req.body;

    if (!result) {
      return res.status(400).json({ error: "No content provided" });
    }

    const doc = new PDFDocument({margin:50})

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="ExamNotesAI.pdf"')

    doc.pipe(res)

    // Title
    doc.fontSize(20).text("ExamNotes AI", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Importance: ${cleanText(result.importance)}`);
    doc.moveDown();

    // Sub Topics
    if (result.subTopics && typeof result.subTopics === 'object') {
      doc.fontSize(16).text("Sub Topics");
      doc.moveDown(0.5);
      Object.entries(result.subTopics).forEach(([star, topics]) => {
        if (Array.isArray(topics)) {
          doc.moveDown(0.5);
          doc.fontSize(13).text(`${cleanText(star)} Topics:`);

          topics.forEach((t) => {
            doc.fontSize(12).text(`- ${cleanText(t)}`);
          });
        }
      });
      doc.moveDown();
    }

    // Notes
    if (result.notes) {
      doc.fontSize(16).text("Notes");
      doc.moveDown(0.5);
      doc.fontSize(12).text(cleanText(result.notes));
      doc.moveDown();
    }

    // Revision Points
    if (result.revisionPoints && Array.isArray(result.revisionPoints)) {
      doc.fontSize(16).text("Revision Points");
      doc.moveDown(0.5);
      result.revisionPoints.forEach((p) => {
        doc.fontSize(12).text(`- ${cleanText(p)}`);
      });
      doc.moveDown();
    }

    // Questions
    if (result.questions) {
      doc.fontSize(16).text("Important Questions");
      doc.moveDown(0.5);

      if (result.questions.short && Array.isArray(result.questions.short)) {
        doc.fontSize(13).text("Short Questions:");
        result.questions.short.forEach((q) => {
          doc.fontSize(12).text(`- ${cleanText(q)}`);
        });
        doc.moveDown(0.5);
      }

      if (result.questions.long && Array.isArray(result.questions.long)) {
        doc.fontSize(13).text("Long Questions:");
        result.questions.long.forEach((q) => {
          doc.fontSize(12).text(`- ${cleanText(q)}`);
        });
        doc.moveDown(0.5);
      }

      if (result.questions.diagram) {
        doc.fontSize(13).text("Diagram Question:");
        doc.fontSize(12).text(cleanText(result.questions.diagram));
      }
    }

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate PDF", message: error.message });
    }
  }
}