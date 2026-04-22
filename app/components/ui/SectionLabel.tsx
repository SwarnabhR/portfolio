// app/components/ui/SectionLabel.tsx

interface SectionLabelProps {
    label: string,
    className?: string
}

export default function SectionLabel({ label, className = ''}: SectionLabelProps){
    return (
        <div
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-regular)',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                color:
            }}
    )
}