export default function AccountSelector({ accounts, selected, onChange }) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
    >
      <option value="all">All Accounts</option>
      {accounts.map((a) => (
        <option key={a.accountNumber} value={a.accountNumber}>
          Account {a.accountNumber.slice(-4)}
        </option>
      ))}
    </select>
  );
}
