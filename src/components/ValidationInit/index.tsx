'use client'

import { useEffect } from "react";
import { initValidation } from "@/common/validation";

export function ValidationInit() {

  useEffect(() => {

    initValidation();

  }, []);

  return null;
}

initValidation();