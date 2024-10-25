import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { App, Notice } from 'obsidian';
export async function generateAndStoreEmbeddings(fileContents: string[], app: App, api: string) {
    const OPENAI_API_KEY = api;
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
    });

    const docs = await textSplitter.createDocuments(fileContents);
  
    // Generate embeddings from documents
    const vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
    );
  
    //Save the vector store
    const directory = ".obsidian/plugins/obsidian-rag/vectors"
    const vectorDirectory = ".obsidian/plugins/obsidian-rag/vectors/vectors.json"
    await app.vault.createFolder(directory);
    const localVectorStore = JSON.stringify(vectorStore.memoryVectors);
    await app.vault.adapter.write(vectorDirectory, localVectorStore);
  }