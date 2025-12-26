import React, { FC, useEffect, useRef, useState } from 'react';

type Props = {
    value: string;
    onSave: (newValue: string) => void;
    className?: string;        // 展示文本的容器类名
    inputClassName?: string;   // 输入框的类名
    placeholder?: string;
    multiline?: boolean;       // 是否为多行（使用 textarea）
    disabled?: boolean;
    maxLength?: number;
};

const InlineEditableText: FC<Props> = ({
    value,
    onSave,
    className,
    inputClassName,
    placeholder = '',
    multiline = false,
    disabled = false,
    maxLength,
}) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const prevRef = useRef(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    useEffect(() => {
        // 外部 value 变化时同步（非编辑时直接同步）
        if (!editing) {
            setDraft(value);
            prevRef.current = value;
        }
    }, [value, editing]);

    useEffect(() => {
        if (editing && inputRef.current) {
            // 聚焦并将光标移到末尾
            const el = inputRef.current;
            el.focus();
            const len = (el as HTMLInputElement).value?.length ?? 0;
            if ('setSelectionRange' in el) {
                try { (el as HTMLInputElement).setSelectionRange(len, len); } catch { }
            }
        }
    }, [editing]);

    const startEditing = () => {
        if (disabled) return;
        prevRef.current = value;
        setDraft(value);
        setEditing(true);
    };

    const cancelEditing = () => {
        setDraft(prevRef.current);
        setEditing(false);
    };

    const saveEditing = () => {
        const trimmed = draft;
        setEditing(false);
        if (trimmed !== prevRef.current) {
            onSave(trimmed);
        }
    };

    const onKeyDownSingle = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEditing();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEditing();
        }
    };

    const onKeyDownMulti = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            cancelEditing();
        }
        // 多行按 Enter 时不保存（允许换行），除非按 Ctrl+Enter 保存（示例）
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            saveEditing();
        }
    };

    return (
        <>
            {!editing ? (
                // 非编辑态：显示文本（可点击）
                <div
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    onClick={startEditing}
                    onKeyDown={(e) => {
                        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            startEditing();
                        }
                    }}
                    className={className ?? 'inline-edit-text cursor-text'}
                    aria-label={placeholder || 'editable text'}
                >
                    {value ?? (placeholder ? <span className="text-muted">{placeholder}</span> : '')}
                </div>
            ) : (
                // 编辑态：input 或 textarea
                multiline ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={saveEditing}
                        onKeyDown={onKeyDownMulti}
                        placeholder={placeholder}
                        className={inputClassName ?? 'inline-edit-input textarea-auto'}
                        maxLength={maxLength}
                        aria-label="编辑文本"
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={saveEditing}
                        onKeyDown={onKeyDownSingle}
                        placeholder={placeholder}
                        className={inputClassName ?? 'inline-edit-input'}
                        maxLength={maxLength}
                        aria-label="编辑文本"
                    />
                )
            )}
            <style jsx>{`
        .inline-edit-text {
          display: inline-block;
          padding: 2px 4px;
          border-radius: 4px;
        }
        .inline-edit-text:focus {
          outline: 2px solid rgba(59,130,246,0.3);
        }
        .inline-edit-input {
          font: inherit;
          padding: 4px 6px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          outline: none;
          min-width: 120px;
        }
        .inline-edit-input:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.12);
        }
        .textarea-auto {
          min-height: 80px;
          resize: vertical;
        }
        .text-muted {
          color: #9ca3af;
        }
      `}</style>
        </>
    );
};

export default InlineEditableText;
