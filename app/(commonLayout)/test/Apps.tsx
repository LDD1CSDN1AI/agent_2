'use client'

import React, { useState } from 'react';
import InlineEditableText from './InlineEditableText';

const Demo = () => {
    const [text, setText] = useState('点击我可以编辑');
    const [multi, setMulti] = useState('这是多行\n点击编辑并按 Ctrl+Enter 保存');

    return (
        <div style={{ padding: 20 }}>
            <h3>单行示例</h3>
            <InlineEditableText
                value={text}
                onSave={(v) => {
                    console.log('保存单行:', v);
                    setText(v);
                }}
                placeholder="点击编辑"
            />

            <h3 style={{ marginTop: 20 }}>多行示例（按 Ctrl+Enter 保存，或失焦保存；Esc 取消）</h3>
            <InlineEditableText
                value={multi}
                onSave={(v) => {
                    console.log('保存多行:', v);
                    setMulti(v);
                }}
                placeholder="多行编辑"
                multiline
            />
        </div>
    );
};

export default Demo;












