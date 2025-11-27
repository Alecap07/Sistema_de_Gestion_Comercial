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
}: ModalDTO): React.JSX.Element {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const closeOverlay = () => {
    setIsOpen(false);
    setView(false);
  };
  
  useEffect(() => {
    const initialData: Record<string, any> = {};
    inputs.forEach((input) => {
      const valueFromDefault = defaultValues[input.name];
      initialData[input.name] =
        valueFromDefault ??
        input.defaultValue ??
        (input.type === "checkbox" ? false : "");
    });
    setFormData(initialData);
  }, [inputs, defaultValues]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <div key={i} className="p-2 sm:col-span-1">
            <label className="block mb-2" htmlFor={input.name}>
              {label}
            </label>
            <select
              id={input.name}
              name={input.name}
              disabled={input.disabled || View ? true : false}
              required={input.required}
              value={formData[input.name] ?? ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-600"
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
          <div key={i} className="p-2 sm:col-span-2">
            <label className="block mb-2" htmlFor={input.name}>
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
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
            />
          </div>
        );

      case "checkbox":
      case "radio":
        return (
          <div key={i} className="p-2 flex items-center gap-2 sm:col-span-2">
            <input
              id={input.name}
              name={input.name}
              type={input.type}
              checked={!!formData[input.name]}
              onChange={handleChange}
              disabled={input.disabled || View ? true : false}
              required={input.required}
              className="h-4 w-4 text-violet-600 focus:ring-violet-600"
            />
            <label htmlFor={input.name}>{label}</label>
          </div>
        );

      default:
        return (
          <div key={i} className="p-2">
            <label className="block mb-2" htmlFor={input.name}>
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
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>
        );
    }
  };

  const gridCols =
    inputs.length > 6
      ? "grid grid-cols-1 sm:grid-cols-2"
      : "grid grid-cols-1";

  return (
    <>
      {isOpen && (
        <div
          onClick={closeOverlay}
          className="flex fixed top-0 left-0 justify-center items-center z-[9999] w-full h-screen overflow-hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white flex flex-col justify-center items-center relative p-5 rounded-lg shadow-lg max-h-[90vh] w-[95%] sm:w-[700px]"
          >
            <div className="flex w-full justify-between items-center px-2 border-b pb-2 mb-2">
              <h1 className="text-xl text-violet-600">{Title}</h1>
              <button
                className="text-2xl text-gray-600 hover:text-black"
                type="button"
                onClick={closeOverlay}
              >
                <IoClose />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className={`${gridCols} gap-2 w-full overflow-y-auto pr-2 max-h-[70vh]`}
            >
              {inputs.map(renderField)}

              {!View && (
                <div className="sm:col-span-2 mt-2">
                  <button
                    className="w-full bg-violet-600 text-white p-2 rounded hover:bg-violet-800 transition"
                    type="submit"
                  >
                    Enviar
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
