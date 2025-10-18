"use client";

import React from "react";

export default function Words(props: any) {
  console.log(props);
  return (
    <div>
      Words {props.pathname}. level : {props.controls.level}
    </div>
  );
}
