"use client";
import { useParams } from "next/navigation";
import { lessons } from "../../../../utils/constants";
import Lesson from "../../../../components/lesson/lesson";
export default function page() {
    var queryParams = useParams();
    var id = queryParams.slug;
    var currentLesson = lessons[id];
    if (!currentLesson) {
        return null;
    }
    return <Lesson lessons={lessons} id={queryParams.slug}/>;
}
