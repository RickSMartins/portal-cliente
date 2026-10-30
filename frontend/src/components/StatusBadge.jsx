import { STATUS } from '../utils/labels';

export default function StatusBadge({ status }) {
  return <span className={`status status-${status}`}>{STATUS[status]}</span>;
}
