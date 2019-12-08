import { useState, useEffect } from "react";

export function decodeFormValues(form: HTMLFormElement) {
  const values = Array.from(form.elements, v => {
    let i = v as HTMLInputElement;
    return [i.name, i.value];
  }).reduce((acc, [k, v]) => {
    if (v) {
      acc[k] = v;
    }
    return acc;
  }, {} as Record<string, string>);
  return values;
}

export function useFormValues(formRef: React.RefObject<HTMLFormElement>) {
  const [, setState] = useState(0);

  useEffect(() => {
    function change() {
      setState(Math.random());
    }
    change();
    const form = formRef.current!;
    form.addEventListener("change", change);
    return () => {
      form.removeEventListener("change", change);
    };
  }, [formRef]);
  return formRef.current ? decodeFormValues(formRef.current) : {};
}
