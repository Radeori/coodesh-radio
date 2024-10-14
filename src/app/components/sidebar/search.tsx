import styles from "./search.module.css";

export default function SearchForm({setSearchQuery}) {
  return (
    <form onSubmit={(event) => event.preventDefault()} className={"nav navbar-form text-center " + styles.navSidebar}>
      <div className={"form-group " + styles.searchFormGroup}>
        <input type="text" onChange={(event) => setSearchQuery(event.target.value)} className={"form-control " + styles.inputSearch} placeholder="Search here" />
      </div>
    </form>
  )
}