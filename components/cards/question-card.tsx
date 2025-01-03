import Link from 'next/link';
import Image from 'next/image';
import { Eye, MessageCircle, ThumbsUp } from 'lucide-react';
import { SignedIn } from '@clerk/nextjs';
import { tagVariants } from '../tags-badge';
import getTimeStamp from '@/utils/getTimeStamp';
import getFormatNumber from '@/utils/getFormatNumber';
import { cn } from '@/lib/utils';
import EditDeleteAction from '../edit-delete-action';

interface Props {
  question: any;
  clerkId?: string | null;
}

export default function QuestionCard({ question, clerkId }: Props) {
  const { id, title, tags, views, upvotes, author, answers, createdAt } = question;
  const showActionButtons = clerkId && clerkId === author?.clerkId;

  return (
    <div className="card-wrapper rounded-lg p-9 sm:px-11">
      <div className="flex flex-col">
        <p className="subtle-regular text-dark400_light700 lg:hidden">
          {getTimeStamp(createdAt)} ago
        </p>
        <div className="flex items-center justify-between">
          <Link href={`/question/${question._id}`}>
            <h3 className="h3-semibold text-dark200_light900 line-clamp-1">{title}</h3>
          </Link>
          <SignedIn>
            {showActionButtons && <EditDeleteAction type="Question" itemId={id} />}
          </SignedIn>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-3">
        {tags.map((tag: any) => (
          <Link href={`/tags/${tag._id}`} key={tag._id} className={cn(tagVariants({ size: 'sm' }))}>
            {tag.name}
          </Link>
        ))}
      </div>
      <div>
        <hr className="mt-2" />
        <div className="small-medium mt-2 flex justify-between gap-3 text-slate-400 max-md:flex-col">
          <div className="flex items-center gap-1">
            {author && author.username ? (
              <Link href={`profile/${author.username}`} className="flex items-center gap-2">
                <Image
                  src={author.picture}
                  alt={author.name}
                  width={25}
                  height={25}
                  className="h-5 w-5 rounded-full"
                />
                <p className="text-[13px] hover:underline">{author.name}</p>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-gray-300" />
                <p className="text-[13px] text-gray-400">Unknown Author</p>
              </div>
            )}
            <p className="subtle-regular text-dark400_light700 hidden lg:flex">
              - asked {getTimeStamp(createdAt)} ago
            </p>
          </div>
          <div className="flex items-center gap-4 max-md:justify-end max-sm:justify-between">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5 stroke-blue-500" />
              {getFormatNumber(upvotes.length)} {upvotes.length > 1 ? 'Votes' : 'Vote'}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5 stroke-foreground" />
              {getFormatNumber(answers.length)} {answers.length > 1 ? 'Answers' : 'Answer'}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 stroke-slate-500" />
              {getFormatNumber(views)} {views > 1 ? 'Views' : 'View'}
            </div>
          </div>
        </div>
        <hr className="mt-2" />
      </div>
    </div>
  );
}
