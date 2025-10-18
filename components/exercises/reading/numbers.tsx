"use client";

import React from "react";

export default function Numbers(props: any) {
  console.log(props);
  return (
    <div>
      numbers {props.pathname}. level : {props.controls.level}
    </div>
  );
}
