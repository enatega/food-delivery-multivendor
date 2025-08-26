import React from 'react'
import { IiconWithTitleProps } from '@/lib/utils/interfaces'

const IconWithTitle: React.FC<IiconWithTitleProps> = ({logo:Logo, title, isBlue = false}) => {
    return (
        <div className="flex items-center justify-center gap-1">
            <Logo/>
            <p className={`${isBlue ? 'text-[#0EA5E9]' : 'text-[#6B7280]'} font-light text-[10px]`}>{title}</p>
        </div>
    )
}

export default IconWithTitle