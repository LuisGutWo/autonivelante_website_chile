import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuList } from "../../config/menu";

export default function Menu(): React.ReactElement {
  const pathname = usePathname();

  return (
    <ul className="navigation clearfix">
      {menuList.map((item, i) => {
        if (item == null) {
          throw new Error("menuList cannot have null items");
        }

        if (item.route == null) {
          throw new Error("menuList items must have a `route` property");
        }

        if (item.name == null) {
          throw new Error("menuList items must have a `name` property");
        }

        return (
          <li key={i}>
            <Link
              className={`link ${pathname === item.route ? "active" : ""}`}
              href={item.route}
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
