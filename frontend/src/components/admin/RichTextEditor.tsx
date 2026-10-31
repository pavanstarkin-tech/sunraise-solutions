import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Code, Link as LinkIcon, Image as ImageIcon,
  Table as TableIcon, Video, AlertCircle, Info, CheckCircle2, Quote, Heading1, Heading2,
  Heading3, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  RotateCcw, RotateCw, RemoveFormatting, Eye, FileCode, Check, X, UploadCloud,
  ExternalLink, Subscript, Superscript, Minus, Sparkles
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onSaveDraft?: () => void;
  onUploadImage?: (file: File) => Promise<string>;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onSaveDraft,
  onUploadImage
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value || '');

  // Modals
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageAlign, setImageAlign] = useState<'center' | 'left' | 'right'>('center');
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);

  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState('');

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Sync internal state with prop value
  useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setHtmlContent(value || '');
  }, [value, isHtmlMode]);

  // Compute metrics
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const charCount = textContent.length;
  const wordCount = textContent ? textContent.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlContent(html);
      onChange(html);
    }
  }, [onChange]);

  const executeCommand = (command: string, val: string | undefined = undefined) => {
    if (isHtmlMode) return;
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        executeCommand('bold');
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        executeCommand('italic');
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        executeCommand('underline');
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (onSaveDraft) onSaveDraft();
      }
    }
  };

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      setIsHtmlMode(false);
      onChange(htmlContent);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = htmlContent;
        }
      }, 0);
    } else {
      const currentHtml = editorRef.current?.innerHTML || '';
      setHtmlContent(currentHtml);
      setIsHtmlMode(true);
    }
  };

  const insertHtmlAtCursor = (htmlToInsert: string) => {
    if (isHtmlMode) {
      setHtmlContent((prev) => prev + '\n' + htmlToInsert);
      onChange(htmlContent + '\n' + htmlToInsert);
      return;
    }

    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.getRangeAt && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const el = document.createElement('div');
      el.innerHTML = htmlToInsert;
      const frag = document.createDocumentFragment();
      let node;
      let lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      if (lastNode) {
        const newRange = range.cloneRange();
        newRange.setStartAfter(lastNode);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
    } else {
      if (editorRef.current) {
        editorRef.current.innerHTML += htmlToInsert;
      }
    }
    handleInput();
  };

  // Insert Link
  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;

    let targetUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(targetUrl) && !targetUrl.startsWith('/') && !targetUrl.startsWith('#')) {
      targetUrl = 'https://' + targetUrl;
    }

    const text = linkText.trim() || targetUrl;
    const targetAttr = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const linkHtml = `<a href="${targetUrl}"${targetAttr} class="text-orange-600 font-bold hover:underline" style="color:#ea580c; text-decoration:underline;">${text}</a>`;

    insertHtmlAtCursor(linkHtml);
    setLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
  };

  // Open Link Modal with selected text
  const openLinkModal = () => {
    if (isHtmlMode) return;
    const sel = window.getSelection();
    const selectedText = sel ? sel.toString() : '';
    setLinkText(selectedText);
    setLinkUrl('');
    setLinkNewTab(true);
    setLinkModalOpen(true);
  };

  // Inline Image Upload Handler
  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;

    setUploadingInlineImage(true);
    try {
      const uploadedUrl = await onUploadImage(file);
      setImageUrl(uploadedUrl);
      if (!imageAlt) {
        setImageAlt(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingInlineImage(false);
      if (inlineFileInputRef.current) inlineFileInputRef.current.value = '';
    }
  };

  // Insert Image
  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    const alignStyle = imageAlign === 'center'
      ? 'display:block; margin:1.5rem auto; max-width:100%; height:auto; border-radius:12px;'
      : imageAlign === 'left'
      ? 'float:left; margin:0 1.5rem 1rem 0; max-width:45%; height:auto; border-radius:12px;'
      : 'float:right; margin:0 0 1rem 1.5rem; max-width:45%; height:auto; border-radius:12px;';

    let imgHtml = '';
    if (imageCaption.trim()) {
      imgHtml = `<figure style="margin:1.75rem 0; text-align:${imageAlign}; clear:both;">
  <img src="${imageUrl}" alt="${imageAlt || 'Article illustration'}" style="${alignStyle}" loading="lazy" />
  <figcaption style="font-size:0.8rem; color:#64748b; margin-top:0.5rem; font-style:italic;">${imageCaption.trim()}</figcaption>
</figure><p></p>`;
    } else {
      imgHtml = `<img src="${imageUrl}" alt="${imageAlt || 'Article illustration'}" style="${alignStyle}" loading="lazy" /><p></p>`;
    }

    insertHtmlAtCursor(imgHtml);
    setImageModalOpen(false);
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setImageAlign('center');
  };

  // Insert Table
  const handleInsertTable = () => {
    const rows = Math.max(1, tableRows);
    const cols = Math.max(1, tableCols);
    let tableHtml = `<div style="overflow-x:auto; margin:1.5rem 0;"><table style="width:100%; border-collapse:collapse; border:1px solid #e2e8f0; font-size:0.85rem;">\n<thead>\n<tr style="background:#f8fafc;">\n`;
    for (let c = 0; c < cols; c++) {
      tableHtml += `  <th style="border:1px solid #cbd5e1; padding:10px 14px; font-weight:700; text-align:left; color:#1e293b;">Header ${c + 1}</th>\n`;
    }
    tableHtml += `</tr>\n</thead>\n<tbody>\n`;
    for (let r = 0; r < rows; r++) {
      tableHtml += `<tr style="${r % 2 === 1 ? 'background:#f8fafc;' : ''}">\n`;
      for (let c = 0; c < cols; c++) {
        tableHtml += `  <td style="border:1px solid #cbd5e1; padding:8px 14px; color:#334155;">Data ${r + 1},${c + 1}</td>\n`;
      }
      tableHtml += `</tr>\n`;
    }
    tableHtml += `</tbody>\n</table></div>\n<p></p>`;

    insertHtmlAtCursor(tableHtml);
    setTableModalOpen(false);
  };

  // Insert Video Embed
  const handleInsertEmbed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!embedCode.trim()) return;

    let code = embedCode.trim();
    if (!code.startsWith('<iframe') && !code.startsWith('<blockquote')) {
      const youtubeMatch = code.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (youtubeMatch && youtubeMatch[1]) {
        const videoId = youtubeMatch[1];
        code = `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:14px; margin:1.75rem 0; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
  <iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe>
</div><p></p>`;
      }
    }

    insertHtmlAtCursor(code);
    setEmbedModalOpen(false);
    setEmbedCode('');
  };

  // Insert Callout Alert Box
  const handleInsertCallout = (type: 'info' | 'success' | 'warning' | 'quote') => {
    let calloutHtml = '';
    if (type === 'info') {
      calloutHtml = `<div style="background:#eff6ff; border-left:4px solid #3b82f6; padding:1rem 1.25rem; border-radius:8px; margin:1.5rem 0; color:#1e40af; font-size:0.9rem;">
  <strong>Note:</strong> Enter important background information or implementation notes here.
</div><p></p>`;
    } else if (type === 'success') {
      calloutHtml = `<div style="background:#ecfdf5; border-left:4px solid #10b981; padding:1rem 1.25rem; border-radius:8px; margin:1.5rem 0; color:#065f46; font-size:0.9rem;">
  <strong>Key Result:</strong> Enter verified achievement, performance milestone, or takeaway here.
</div><p></p>`;
    } else if (type === 'warning') {
      calloutHtml = `<div style="background:#fffbeb; border-left:4px solid #f59e0b; padding:1rem 1.25rem; border-radius:8px; margin:1.5rem 0; color:#92400e; font-size:0.9rem;">
  <strong>Important:</strong> Enter critical prerequisites, security notice, or gotchas to avoid.
</div><p></p>`;
    } else {
      calloutHtml = `<blockquote style="border-left:4px solid #ea580c; padding:0.75rem 1.25rem; margin:1.5rem 0; color:#334155; font-style:italic; background:#fff7ed; border-radius:0 8px 8px 0; font-size:0.95rem;">
  "Enter quotation or client statement here."
</blockquote><p></p>`;
    }

    insertHtmlAtCursor(calloutHtml);
  };

  const btnClass = "p-1.5 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-700 transition flex items-center justify-center";

  return (
    <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-warm">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 select-none">
        {/* Undo / Redo */}
        <button
          type="button"
          title="Undo (Ctrl+Z)"
          onClick={() => executeCommand('undo')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Redo (Ctrl+Y)"
          onClick={() => executeCommand('redo')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Headings Formats */}
        <select
          onChange={(e) => {
            if (e.target.value) executeCommand('formatBlock', e.target.value);
            e.target.value = '';
          }}
          disabled={isHtmlMode}
          defaultValue=""
          className="px-2.5 py-1 text-xs font-bold text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none"
        >
          <option value="" disabled>Block Format</option>
          <option value="<p>">Paragraph (Normal)</option>
          <option value="<h2>">Heading 2 (H2)</option>
          <option value="<h3>">Heading 3 (H3)</option>
          <option value="<h4>">Heading 4 (H4)</option>
          <option value="<blockquote>">Blockquote</option>
          <option value="<pre>">Code Block</option>
        </select>

        {/* Quick Heading Buttons */}
        <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg border border-gray-200/60">
          <button
            type="button"
            title="Heading 2 (Section Title)"
            onClick={() => executeCommand('formatBlock', '<h2>')}
            disabled={isHtmlMode}
            className="px-2 py-0.5 rounded text-[11px] font-black text-gray-700 hover:text-orange-600 hover:bg-white transition"
          >
            H2
          </button>
          <button
            type="button"
            title="Heading 3 (Sub-section)"
            onClick={() => executeCommand('formatBlock', '<h3>')}
            disabled={isHtmlMode}
            className="px-2 py-0.5 rounded text-[11px] font-black text-gray-700 hover:text-orange-600 hover:bg-white transition"
          >
            H3
          </button>
          <button
            type="button"
            title="Heading 4 (Minor Heading)"
            onClick={() => executeCommand('formatBlock', '<h4>')}
            disabled={isHtmlMode}
            className="px-2 py-0.5 rounded text-[11px] font-black text-gray-700 hover:text-orange-600 hover:bg-white transition"
          >
            H4
          </button>
          <button
            type="button"
            title="Paragraph Text"
            onClick={() => executeCommand('formatBlock', '<p>')}
            disabled={isHtmlMode}
            className="px-2 py-0.5 rounded text-[11px] font-bold text-gray-600 hover:text-orange-600 hover:bg-white transition"
          >
            P
          </button>
        </div>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Text Styling */}
        <button
          type="button"
          title="Bold (Ctrl+B)"
          onClick={() => executeCommand('bold')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Italic (Ctrl+I)"
          onClick={() => executeCommand('italic')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Underline (Ctrl+U)"
          onClick={() => executeCommand('underline')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Strikethrough"
          onClick={() => executeCommand('strikeThrough')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Text Alignment */}
        <button
          type="button"
          title="Align Left"
          onClick={() => executeCommand('justifyLeft')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Align Center"
          onClick={() => executeCommand('justifyCenter')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Align Right"
          onClick={() => executeCommand('justifyRight')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Lists */}
        <button
          type="button"
          title="Bullet List"
          onClick={() => executeCommand('insertUnorderedList')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Numbered List"
          onClick={() => executeCommand('insertOrderedList')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Rich Media & Elements to Insert */}
        <button
          type="button"
          title="Insert Link"
          onClick={openLinkModal}
          disabled={isHtmlMode}
          className={`${btnClass} text-orange-600`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Insert Inline Image"
          onClick={() => setImageModalOpen(true)}
          disabled={isHtmlMode}
          className={`${btnClass} text-orange-600`}
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Insert Table"
          onClick={() => setTableModalOpen(true)}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <TableIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Embed YouTube / Media"
          onClick={() => setEmbedModalOpen(true)}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <Video className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Callout Presets */}
        <button
          type="button"
          title="Insert Info Callout"
          onClick={() => handleInsertCallout('info')}
          disabled={isHtmlMode}
          className={`${btnClass} text-blue-600`}
        >
          <Info className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Insert Success Callout"
          onClick={() => handleInsertCallout('success')}
          disabled={isHtmlMode}
          className={`${btnClass} text-emerald-600`}
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Insert Warning Callout"
          onClick={() => handleInsertCallout('warning')}
          disabled={isHtmlMode}
          className={`${btnClass} text-amber-600`}
        >
          <AlertCircle className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Insert Quote Callout"
          onClick={() => handleInsertCallout('quote')}
          disabled={isHtmlMode}
          className={`${btnClass} text-orange-600`}
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Clear formatting */}
        <button
          type="button"
          title="Clear Formatting"
          onClick={() => executeCommand('removeFormat')}
          disabled={isHtmlMode}
          className={btnClass}
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        {/* Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleHtmlMode}
          className={`ml-auto px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
            isHtmlMode
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-700 hover:text-orange-600'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>{isHtmlMode ? 'Visual Mode' : 'HTML Source'}</span>
        </button>
      </div>

      {/* EDITOR CANVAS */}
      <div className="relative">
        {isHtmlMode ? (
          <textarea
            value={htmlContent}
            onChange={(e) => {
              setHtmlContent(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="<!-- Enter or edit raw HTML markup... -->"
            spellCheck={false}
            className="w-full min-h-[400px] p-6 font-mono text-[13px] leading-relaxed resize-y focus:outline-none selection:bg-orange-500 selection:text-white"
            style={{
              backgroundColor: '#0f172a',
              color: '#38bdf8',
              caretColor: '#f97316',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              tabSize: 2
            }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="min-h-[380px] max-h-[700px] overflow-y-auto p-6 focus:outline-none text-sm text-gray-900 leading-relaxed font-sans prose prose-orange max-w-none"
            style={{ minHeight: '380px' }}
          />
        )}
      </div>

      {/* STATUS / METRICS FOOTER BAR */}
      <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-bold text-gray-700">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{isHtmlMode ? 'HTML Source Mode' : 'WYSIWYG Visual Canvas'}</span>
          </span>
          <span>•</span>
          <span><strong>{wordCount}</strong> words</span>
          <span>•</span>
          <span><strong>{charCount}</strong> characters</span>
          <span>•</span>
          <span>Estimated <strong>{readingTime} min</strong> read</span>
        </div>

        <div className="text-[11px] text-gray-400">
          Pro-tip: Press <strong>Ctrl+B</strong> for bold, <strong>Ctrl+I</strong> for italic, <strong>Ctrl+S</strong> to save
        </div>
      </div>

      {/* 1. INSERT LINK MODAL */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 font-heading">
                Insert Hyperlink
              </h3>
              <button onClick={() => setLinkModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertLink} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Target Web URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com or /services/..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Anchor Text (Optional)</label>
                <input
                  type="text"
                  placeholder="Click here / learn more"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="linkNewTab"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <label htmlFor="linkNewTab" className="text-xs text-gray-700 cursor-pointer">
                  Open link in new browser tab
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sunraise"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. INSERT INLINE IMAGE MODAL */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 font-heading">
                Insert Article Image
              </h3>
              <button onClick={() => setImageModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertImage} className="space-y-3">
              {/* Device Upload Option */}
              {onUploadImage && (
                <div>
                  <input
                    type="file"
                    ref={inlineFileInputRef}
                    onChange={handleInlineImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => inlineFileInputRef.current?.click()}
                    disabled={uploadingInlineImage}
                    className="w-full py-2.5 px-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingInlineImage ? 'Uploading Image...' : 'Upload Image from Device'}</span>
                  </button>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... or uploaded URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Alt Text (Accessibility &amp; SEO)</label>
                <input
                  type="text"
                  placeholder="Descriptive image summary"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="Caption text displayed beneath image"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Alignment</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['left', 'center', 'right'] as const).map(al => (
                    <button
                      key={al}
                      type="button"
                      onClick={() => setImageAlign(al)}
                      className={`py-1.5 text-xs font-bold capitalize rounded-xl border transition ${
                        imageAlign === al
                          ? 'bg-orange-50 border-orange-300 text-orange-700'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      {al}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sunraise"
                >
                  Insert Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. INSERT TABLE MODAL */}
      {tableModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 font-heading">
                Insert Comparison / Data Table
              </h3>
              <button onClick={() => setTableModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 2)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 2)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setTableModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sunraise"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. INSERT EMBED MODAL */}
      {embedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 font-heading">
                Embed Video / Media
              </h3>
              <button onClick={() => setEmbedModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertEmbed} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">YouTube Video URL or &lt;iframe&gt; code</label>
                <textarea
                  rows={3}
                  required
                  placeholder="https://www.youtube.com/watch?v=... or <iframe>...</iframe>"
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEmbedModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sunraise"
                >
                  Insert Embed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
