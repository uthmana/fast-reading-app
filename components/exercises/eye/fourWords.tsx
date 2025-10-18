"use client";

import React from "react";

export default function FourWords(props: any) {
  console.log(props);
  return <div>fourWords. {props.controls.level}</div>;
}
