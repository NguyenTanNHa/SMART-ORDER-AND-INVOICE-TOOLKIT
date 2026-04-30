export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">Configure your toolkit preferences.</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
        <h3 className="font-semibold text-lg mb-4 text-slate-800">Database Options</h3>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Your data is stored locally in <code>data.db</code>.</p>
        </div>
      </div>
    </div>
  )
}
