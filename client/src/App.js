"use client";

import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Send, Map } from "lucide-react";

export default function Component() {
  const [topic, setTopic] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [question, setQuestion] = useState("");
  const [quotedText, setQuotedText] = useState(""); // For quoting
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [roadmapError, setRoadmapError] = useState(null);
  const [questionError, setQuestionError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]); // Store chat history

  // Function to quote a text or video
  const handleQuote = (quote, link = null) => {
    if (link) {
      setQuotedText(`${quote} (Link: ${link})`);
    } else {
      setQuotedText(quote);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!topic.trim()) {
      setRoadmapError("Please enter a topic.");
      return;
    }

    setLoadingRoadmap(true);
    setRoadmapError(null);
    setRoadmap("");

    try {
      const response = await axios.post("http://localhost:5000/api/generate-roadmap", { topic });
      setRoadmap(response.data.roadmap);
    } catch (err) {
      console.error("Error fetching roadmap:", err);
      const errorMessage = err.response?.data?.details || "Failed to generate roadmap. Please try again.";
      setRoadmapError(errorMessage);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!question.trim()) {
      setQuestionError("Please enter a question.");
      return;
    }

    setLoadingQuestion(true);
    setQuestionError(null);

    const fullQuestion = quotedText ? `"${quotedText}" - ${question}` : question;

    try {
      const response = await axios.post("http://localhost:5000/api/ask-question", { question: fullQuestion });

      // Update chat history with the new Q&A pair
      setChatHistory((prevChat) => [
        ...prevChat,
        { question: fullQuestion, answer: response.data.answer },
      ]);

      setQuestion("");
      setQuotedText(""); // Clear the quoted text
    } catch (err) {
      console.error("Error submitting question:", err);
      const errorMessage = err.response?.data?.details || "Failed to get an answer. Please try again.";
      setQuestionError(errorMessage);
    } finally {
      setLoadingQuestion(false);
    }
  };

  // Define how links and headings should behave in ReactMarkdown
  const markdownComponents = {
    a: ({ href, children }) => (
      <div className="flex justify-between items-center">
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {children}
        </a>
        <Button
          onClick={() => handleQuote(children, href)}
          className="ml-2 text-sm text-gray-700 underline"
        >
          Quote this
        </Button>
      </div>
    ),
    h2: ({ children }) => (
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-800">
          {children}
        </h2>
        <Button
          onClick={() => handleQuote(children)}
          className="ml-2 text-sm text-gray-700 underline"
        >
          Quote this
        </Button>
      </div>
    ),
    p: ({ children }) => (
      <p className="text-base text-gray-700 mb-2">
        {children}
      </p>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gemini Learning Roadmap Generator</h1>
          <p className="text-gray-600">Enter a topic to generate a personalized learning roadmap</p>
        </header>

        {/* Roadmap Generator Section */}
        <Card className="mb-10 bg-white shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl">Create Your Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <Input
                placeholder="Enter a topic (e.g., Machine Learning)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-grow bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg p-2"
              />
              <Button
                onClick={handleGenerateRoadmap}
                disabled={loadingRoadmap}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
              >
                <Map className="mr-2 h-4 w-4" />
                {loadingRoadmap ? 'Generating...' : 'Generate Roadmap'}
              </Button>
            </div>
            {roadmapError && <p className="mt-2 text-red-500">{roadmapError}</p>}
          </CardContent>
        </Card>

        {/* Tabs for Roadmap and Q&A */}
        <Tabs defaultValue="qa" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-gray-300 rounded-lg overflow-hidden">
            <TabsTrigger value="roadmap" className="py-2 text-gray-800 font-medium hover:bg-gray-400 focus:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="qa" className="py-2 text-gray-800 font-medium hover:bg-gray-400 focus:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Q&A
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qa">
            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle>Ask a Question</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Chat History Display */}
                <div className="mb-6 h-80 overflow-y-auto bg-gray-100 p-4 rounded-lg border border-gray-300 space-y-4">
                  {chatHistory.length === 0 ? (
                    <p className="text-gray-500">No questions asked yet. Ask your first question below.</p>
                  ) : (
                    chatHistory.map((chat, index) => (
                      <div key={index}>
                        {/* Question */}
                        <div className="bg-blue-100 p-3 rounded-lg mb-2">
                          <p className="text-blue-900 font-semibold">You:</p>
                          <p>{chat.question}</p>
                        </div>

                        {/* Answer */}
                        <div className="bg-green-100 p-3 rounded-lg mb-2">
                          <p className="text-green-900 font-semibold">Gemini:</p>
                          <p>{chat.answer}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Quoted Text (if any) */}
                {quotedText && (
                  <div className="p-2 mb-4 bg-gray-100 rounded-lg border border-gray-300 text-sm text-gray-700">
                    Quoting: <em>{quotedText}</em>
                  </div>
                )}

                {/* Input for asking questions */}
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <Textarea
                    placeholder="Type your question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="flex-grow bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg p-2"
                  />
                  <Button
                    onClick={handleSubmitQuestion}
                    disabled={loadingQuestion}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {loadingQuestion ? 'Asking...' : 'Ask'}
                  </Button>
                </div>
                {questionError && <p className="mt-2 text-red-500">{questionError}</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap">
            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle>Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingRoadmap ? (
                  <p>Loading roadmap...</p>
                ) : roadmap ? (
                  <ReactMarkdown components={markdownComponents}>
                    {roadmap}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-500">No roadmap generated yet. Enter a topic to generate one.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
