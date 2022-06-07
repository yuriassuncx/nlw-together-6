import { ReactNode } from 'react'
import cx from 'classnames'

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

export function Question({
    content,
    author,
    isAnswered = false,
    isHighlighted = false,
    children,
}: QuestionProps) {
    return (
        <div
            className={cx(
                'question',
                { 'answered': isAnswered },
                { 'highlighted': isHighlighted && !isAnswered },
            )}
        >
            <p className="text-[#29292e]">{content}</p>
            <footer className="flex justify-between items-center mt-6">
                <div className="flex items-center">
                    <img src={author.avatar} alt={author.name} className='w-8 h-8 rounded-xl' />
                    { isHighlighted ? (
                        <span className="ml-2 text-[#29292E] text-sm">{author.name}</span>
                    ): (
                        <span className="ml-2 text-[#737380] text-sm">{author.name}</span>
                    )}
                </div>
                <div className='flex gap-4'>
                    {children}
                </div>
            </footer>
        </div>
    );
}