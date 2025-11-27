import ReactDOM from "react-dom";
import type { Toast } from "../hooks/useToast";

interface ToastContainerProps {
    toasts: Toast[];
}

export default function ToastContainer({ toasts }: ToastContainerProps) {
    return ReactDOM.createPortal(
        <div className="toast-container">
            {toasts.map((t) => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    {t.message}
                </div>
            ))}
        </div>,
        document.body
    );
}
