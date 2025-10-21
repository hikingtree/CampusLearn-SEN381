import { ForumPost } from '../ForumPost';

export default function ForumPostExample() {
  return (
    <div className="p-6 max-w-3xl">
      <ForumPost
        id="example-1"
        title="How to approach binary tree traversal problems?"
        content="I'm struggling with understanding the difference between in-order, pre-order, and post-order traversal. Can someone explain with examples?"
        author="John Smith"
        isAnonymous={false}
        timestamp="2 hours ago"
        upvotes={24}
        replyCount={8}
        tags={["Data Structures", "BIT 302"]}
        hasUpvoted={false}
      />
    </div>
  );
}
