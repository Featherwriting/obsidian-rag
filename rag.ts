import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { App, normalizePath } from 'obsidian';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { formatDocumentsAsString } from "langchain/util/document";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { SynchronousInMemoryDocstore } from "@langchain/community/stores/doc/in_memory";

export async function chat(message: string, app: App, api: string) {
    const OPENAI_API_KEY = api;
    const model = new ChatOpenAI({
        openAIApiKey: OPENAI_API_KEY,
    });
    const directory = ".obsidian/plugins/obsidian-rag/vectors/vectors.json"
    const normalizedPath = normalizePath(directory);
    const vectors = await app.vault.adapter.read(`${normalizedPath}`);
    const memoryVectorStore: MemoryVectorStore = new MemoryVectorStore(new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }));
    const jsonData = JSON.parse(vectors);
    jsonData.forEach((x: any) => memoryVectorStore.addVectors(jsonData.map((x: { embedding: any; }) => x.embedding), jsonData.map((x: { content: any; id: any; }) => {
        return {
            pageContent: x.content,
            metadata: { id: x.id }
        }
    })));
    const retriever = memoryVectorStore.asRetriever();

    const prompt = PromptTemplate.fromTemplate(`Answer the question based only on the following context:
    {context} 
    Question: {question}`);

    const chain = RunnableSequence.from([
        {
            context: retriever.pipe(formatDocumentsAsString),
            question: new RunnablePassthrough(),
        },
        prompt,
        model,
        new StringOutputParser(),
    ]);

    const result = await chain.invoke(message);
    return result;
}

