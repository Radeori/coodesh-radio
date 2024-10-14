import styles from "./search.module.css";
import { SetStringState } from "@/types";

interface Arguments{
  setSearchQuery: SetStringState
}

export default function SearchForm({setSearchQuery}:Arguments) {
  return (
    <form onSubmit={(event) => event.preventDefault()} className={"nav navbar-form text-center " + styles.navSidebar}>
      <div className={"form-group " + styles.searchFormGroup}>
        <input type="text" onChange={(event) => setSearchQuery(event.currentTarget.value)} className={"form-control " + styles.inputSearch} placeholder="Search here" />
      </div>
    </form>
  )
}