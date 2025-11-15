"use client";
export default function TableEmpty(props) {
    var _a = props.text, text = _a === void 0 ? "Tabloda yeni veri bulunmamaktadır." : _a;
    return (<div className="sticky left-0 w-full py-8 text-center opacity-40">
      {text}
    </div>);
}
