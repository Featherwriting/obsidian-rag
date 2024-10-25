import { App, Modal, Plugin, Setting, TFile, Notice } from 'obsidian';
import { generateAndStoreEmbeddings } from './embedding';
import { chat } from './rag';
import { SettingTab } from './setting';

interface PluginSettings {
	api: string;
}

export default class MyPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SettingTab(this.app, this));
		
		// File selector
		this.addCommand({
		id: 'open-file-selector',
		name: 'Open File Selector',
		callback: () => {
			new FileSelectorModal(this.app, this.processFiles).open();
		},
		});

		// Chat dialog
		this.addCommand({
			id: 'open-chat-dialog',
			name: 'Open Chat Dialog',
			callback: () => {
			new ChatModal(this.app, this.settings.api).open();
			},
		});
  	}
	processFiles = async (files: TFile[]) => {
		const fileContents: string[] = [];

		// read all files selected
		for (const file of files) {
			const content = await this.app.vault.read(file);
			fileContents.push(content);
		}

		generateAndStoreEmbeddings(fileContents, this.app, this.settings.api);
	};
	async loadSettings() {
		this.settings = Object.assign({}, "", await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class FileSelectorModal extends Modal {
	private onSubmit: (files: TFile[]) => void;
	private selectedFiles: Set<TFile>;

	constructor(app: App, onSubmit: (files: TFile[]) => void) {
		super(app);
		this.app = app;
		this.onSubmit = onSubmit;
		this.selectedFiles = new Set();
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl('h2', { text: 'Select Files' });

		const files = this.app.vault.getFiles();

		files.forEach((file) => {
		new Setting(contentEl)
			.setName(file.name)
			.addToggle((toggle) => {
			toggle.onChange((value) => {
				if (value) {
				this.selectedFiles.add(file);
				} else {
				this.selectedFiles.delete(file);
				}
			});
			});
		});

		new Setting(contentEl)
		.addButton((btn) =>
			btn
			.setButtonText('Submit')
			.setCta()
			.onClick(() => {
				this.onSubmit(Array.from(this.selectedFiles));
				this.close();
			})
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}


class ChatModal extends Modal {
	private chatHistory: { user: string; ai: string }[] = [];
	private inputEl: HTMLTextAreaElement;
	private chatEl: HTMLElement; 
	private api: string
  
	constructor(app: App, api: string) {
	  	super(app);
	  	this.api = api;
	}
  
	onOpen() {
		const { contentEl } = this;
		contentEl.createEl('h2', { text: 'Chat with AI' });

		this.chatEl = contentEl.createDiv({ cls: 'chat-history' });

		this.inputEl = contentEl.createEl('textarea', {
			placeholder: 'Type your message...',
		});
		new Setting(contentEl)
			.addButton((btn) =>
			btn
				.setButtonText('Send')
				.setCta()
				.onClick(() => {
				this.handleSendMessage();
				})
			);

		this.updateChatDisplay();
	}

	async handleSendMessage() {
		const userMessage = this.inputEl.value;
		if (!userMessage) return;
	
		this.inputEl.value = '';
		const aiResponse = await chat(userMessage, this.app ,this.api);
		this.chatHistory.push({ user: userMessage, ai: aiResponse });

		this.updateChatDisplay();
	}
  
	updateChatDisplay() {
		this.chatEl.empty(); 
	
		this.chatHistory.forEach((entry) => {
			const userMessageEl = this.chatEl.createDiv({ cls: 'chat-message user' });
			userMessageEl.textContent = 'You: ' + entry.user;
	
			const aiMessageEl = this.chatEl.createDiv({ cls: 'chat-message ai' });
			aiMessageEl.textContent = 'AI: ' + entry.ai;
		});
	}
  
	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}