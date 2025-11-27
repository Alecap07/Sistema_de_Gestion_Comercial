import type React from "react";
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

type BaseField = {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: any;
  value?: any;
};

type InputField = BaseField &
  React.InputHTMLAttributes<HTMLInputElement> & {
    type:
    | "text"
    | "number"
    | "password"
    | "email"
    | "checkbox"
    | "radio"
    | "date"
    | "time"
    | "datetime-local"
    | "file";
  };

type SelectField = BaseField &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    type: "select";
    options: { label: string; value: string | number }[];
  };

type TextAreaField = BaseField &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    type: "textarea";
  };

export type ModalField = InputField | SelectField | TextAreaField;

type ModalDTO = {
  inputs: ModalField[];
  onSubmit?: (data: Record<string, any>) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  Title: string;
  View: boolean | null;
  setView: (value: boolean) => void | null;
  defaultValues?: Record<string, any>;
  onEdit?: boolean;
  children?: React.ReactNode;
  onFieldChange?: (name: string, value: any) => void;
};

export function Modal({
  inputs,
  onSubmit,
  isOpen,
  View,
  setView,
  setIsOpen,
  Title,
  defaultValues = {},
  onEdit = false,
  children,
  onFieldChange,
}: ModalDTO): React.JSX.Element {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const closeOverlay = () => {
    setIsOpen(false);
    setView(false);
  };

  useEffect(() => {
    if (!isOpen) return; // solo cuando se abre el modal

    const initialData: Record<string, any> = {};
    inputs.forEach((input) => {
      const valueFromDefault = defaultValues[input.name];
      initialData[input.name] =
        valueFromDefault ??
        input.defaultValue ??
        (input.type === "checkbox" ? false : "");
    });
    setFormData(initialData);
  }, [isOpen]); // <-- SACAMOS defaultValues


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    let value: any;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = target.checked;
    } else {
      value = target.value;
    }

    setFormData((prev) => ({
      ...prev,
      [target.name]: value,
    }));

    if (onFieldChange) {
      onFieldChange(target.name, value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onEdit) {
      // when editing, show confirmation submodal
      setShowConfirmModal(true);
      return;
    }
    if (onSubmit) onSubmit(formData);
  };

  function FirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const renderField = (input: ModalField, i: number) => {
    const label = input.label || FirstLetter(input.name);

    switch (input.type) {
      case "select":
        return (
          <div key={i} className="input-container">
            <label className="Plabel" htmlFor={input.name}>
              {label}
            </label>
            <select
              id={input.name}
              name={input.name}
              disabled={input.disabled || View ? true : false}
              required={input.required}
              value={formData[input.name] ?? ""}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Seleccionar...</option>
              {input.options?.map((opt, j) => (
                <option key={j} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "textarea":
        return (
          <div key={i} className="input-container" style={{ gridColumn: '1 / -1' }}>
            <label className="Plabel" htmlFor={input.name}>
              {label}
            </label>
            <textarea
              id={input.name}
              name={input.name}
              disabled={input.disabled || View ? true : false}
              required={input.required}
              value={formData[input.name] ?? ""}
              onChange={handleChange}
              rows={4}
              className="form-input input-full"
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={i} className="input-container">
            <div className='form-input-wrapper'>
              <label className="checkbox-wrapper-12">
                <div className="cbx">
                  <input
                    id={input.name}
                    name={input.name}
                    type="checkbox"
                    checked={!!formData[input.name]}
                    onChange={handleChange}
                    disabled={input.disabled || View ? true : false}
                    required={input.required}
                  />
                  <label htmlFor={input.name}></label>
                  <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                    <path d="M2 8.36364L6.23077 12L13 2"></path>
                  </svg>
                </div>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id={`goo-12-${input.name}`}>
                      <feGaussianBlur result="blur" stdDeviation="4" in="SourceGraphic"></feGaussianBlur>
                      <feColorMatrix result={`goo-12-${input.name}`} values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" mode="matrix" in="blur"></feColorMatrix>
                      <feBlend in2={`goo-12-${input.name}`} in="SourceGraphic"></feBlend>
                    </filter>
                  </defs>
                </svg>
                <p className='PCheckInfo'>{label}</p>
              </label>
            </div>
          </div>
        );

      case "radio":
        return (
          <div key={i} className="input-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              id={input.name}
              name={input.name}
              type="radio"
              checked={!!formData[input.name]}
              onChange={handleChange}
              disabled={input.disabled || View ? true : false}
              required={input.required}
              className="form-input"
            />
            <label htmlFor={input.name} className="Plabel">{label}</label>
          </div>
        );

      default:
        return (
          <div key={i} className="input-container">
            <label className="Plabel" htmlFor={input.name}>
              {label}
            </label>
            <input
              id={input.name}
              name={input.name}
              type={input.type}
              value={formData[input.name] ?? ""}
              onChange={handleChange}
              placeholder={input.placeholder}
              disabled={input.disabled || View ? true : false}
              maxLength={input.maxLength}
              minLength={input.minLength}
              max={input.max}
              min={input.min}
              required={input.required}
              className="form-input"
            />
          </div>
        );
    }
  };

  const gridCols = "inputs-container";

  return (
    <>
      {isOpen && (
        <div
          onClick={closeOverlay}
          className="modal-overlay"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="user-crud-form"
          >
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '8px' }}>
              <h1 className="PTitle">{Title}</h1>
              <button
                className="pregunta-close-button"
                type="button"
                onClick={closeOverlay}
              >
                <IoClose />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className={gridCols}
              style={{ overflowY: 'auto', paddingRight: '8px', maxHeight: '70vh', width: '100%' }}
            >
              {inputs.map(renderField)}
              {children}

              {!View && (
                <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                  <button
                    className="submit-button"
                    type="submit"
                    style={{ width: '100%' }}
                  >
                    Enviar
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setShowConfirmModal(false)}>
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute', inset: 0 }} />
          <div className="user-crud-form" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', zIndex: 10001, width: '90%', maxWidth: '400px', padding: '20px' }}>
            <h3 className="PTitle" style={{ fontSize: '18px', marginBottom: '12px', textAlign: 'center' }}>¿Confirmar operación?</h3>
            <p style={{ marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>¿Seguro que deseas guardar los cambios?</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                className="cancel-button"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </button>
              <button
                className="submit-button"
                onClick={() => {
                  if (onSubmit) onSubmit(formData);
                  setShowConfirmModal(false);
                  setIsOpen(false);
                  setView(false);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
