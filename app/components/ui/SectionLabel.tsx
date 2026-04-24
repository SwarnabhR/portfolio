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
                color: '--var(--fg-1)',
                border: '1px solid var(--border-pill)',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, 0.4)',
                flexShrink: 0,
            }}
            aria-hidden="true"
        >
            {label}
        </div>
    )
}