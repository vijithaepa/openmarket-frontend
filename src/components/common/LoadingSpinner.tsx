export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8'
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${cls} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
    </div>
  )
}
