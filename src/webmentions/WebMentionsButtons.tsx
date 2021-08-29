import { IWebMentionsCount } from '../webmentions'

let HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 fill-current"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
      clipRule="evenodd"
    />
  </svg>
)

let RetweetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 fill-current"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
      clipRule="evenodd"
    />
  </svg>
)

let CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 fill-current"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
  </svg>
)

let Button = ({
  action,
  count,
  icon,
  className,
}: {
  action: string
  count?: number
  icon: JSX.Element
  className: string
}) => (
  <a
    href={`https://twitter.com/intent/${action}`}
    target="_blank"
    className={`flex flex-col gap-1 items-center ${className}`}
  >
    {icon} <span className="text-sm">{count}</span>
  </a>
)

export let WebMentionsButtons = ({
  tweetId,
  like,
  mention,
  repost,
}: IWebMentionsCount & { tweetId: string }) => (
  <div className="flex gap-4">
    <Button
      count={like}
      action={`like?tweet_id=${tweetId}`}
      icon={<HeartIcon />}
      className="hover:text-red-600 dark:text-red-300 dark:hover:text-red-600"
    />

    <Button
      count={repost}
      action={`retweet?tweet_id=${tweetId}`}
      icon={<RetweetIcon />}
      className="hover:text-green-600  dark:text-green-300 dark:hover:text-green-600"
    />

    <Button
      count={mention}
      action={`tweet?in_reply_to=${tweetId}`}
      icon={<CommentIcon />}
      className="hover:text-blue-600  dark:text-blue-300 dark:hover:text-blue-600"
    />
  </div>
)

export default WebMentionsButtons
