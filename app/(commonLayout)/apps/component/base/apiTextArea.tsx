import React, { useState } from 'react'
import TextArea from "antd/es/input/TextArea";
type Props = {
    ApiaddOpen: boolean
    onClose: () => void
}
const apiTextArea: React.FC<Props> = (props) => {
    const { ApiaddOpen, onClose } = props
    const [textArea, setTextArea] = useState<string | null>(null);
    return (
        <TextArea
            style={{
                width:"730px",
                height:"300px",
            }}
            onChange={(e: any) => {
                setTextArea(e.target.value);
            }}
            maxLength={400}
            rows={3}
            placeholder={"介绍项目的内容，目标等，将会展示会给可见的用户"}
        />
    )
}

export default apiTextArea
