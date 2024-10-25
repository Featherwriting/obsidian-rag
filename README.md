# Obsidian Plugin - Note-Based AI Chat using RAG

This Obsidian plugin enables intelligent conversations directly within your notes. Using Retrieval-Augmented Generation (RAG) technology, it reads through your Obsidian vault, processes note content, and allows interactive question-and-answer sessions based on the information in your notes.

## Features

- **AI-Driven Note Retrieval**: Seamlessly retrieve content from your notes and ask questions related to the stored information.
- **Contextual Conversations**: Interact with an AI model that maintains context from your notes, providing relevant and evidence-based responses.
- **Multi-file Support**: Easily select notes or the entire vault for AI processing, with an intuitive selection interface.
- **Persistent Chat History**: Keep a running history of questions and answers for reference and continuity.

## Installation

To install this plugin:

1. Download the latest release from the [Releases](link_to_releases) section.
2. Move the plugin folder to `your-vault/.obsidian/plugins`.
3. Enable the plugin from Obsidian's plugin settings.

## Usage

1. **Configure API**: Fill in your OpenAI API in the plugin settings.
2. **Set Up RAG Sources**: Select specific files or enable vault-wide access for the AI to retrieve content.
3. **Ask Questions**: Enter your questions based on the note content, and receive answers contextualized with your data.

## Future Updates

Planned enhancements include:
- Beautify the user interface and operation logic. After the interface is completed, it will be released in the Obsidian plug-in store.
- Consider multi-modal (image) related optimization.
  
## Requirements

- **API Access**: Ensure API keys are available for configured services if required.

## Technical Details

This project utilizes advanced NLP and retrieval techniques to maximize functionality within Obsidian:

- **Frameworks and Libraries**:
  - [Langchain](https://github.com/hwchase17/langchain): Provides the core framework for building RAG applications, managing both prompt generation and memory storage.
  - [OpenAI API](https://platform.openai.com/): Utilized for generating embeddings and handling AI responses.
- **Vector Storage**:
  - **MemoryVectorStore**: The embedding vectors are stored using a local `MemoryVectorStore` solution, saving all vectors in a `vectors` directory. This storage method prevents the need for repeated API calls, enhancing both performance and cost-efficiency.

## License

This project is licensed under the MIT License.

