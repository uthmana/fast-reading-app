import { lessons } from "../../../utils/constants";
import Lesson from "../../../components/lesson/lesson";

export default function page() {
  return <Lesson lessons={lessons} id={"1"} />;
}
