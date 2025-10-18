"use client";

import React from "react";

export default function DancingWords(props: any) {
  console.log(props);
  return <div>dancingWords. {props.controls.level}</div>;
}
