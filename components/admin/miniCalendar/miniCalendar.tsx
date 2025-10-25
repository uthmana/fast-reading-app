"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "./style.css";

const MiniCalendar = (props: { className?: string }) => {
  const { className } = props;
  const [value, onChange] = useState(new Date());

  return (
    <Calendar
      locale="tr-TR"
      className={className}
      onChange={onChange as any}
      value={value}
      prevLabel={<MdChevronLeft className="ml-1 h-6 w-6 " />}
      nextLabel={<MdChevronRight className="ml-1 h-6 w-6 " />}
      view={"month"}
    />
  );
};

export default MiniCalendar;
