"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function DescriptionComponent() {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Alice",
      content: "Great post!",
      avatar: "/placeholder.svg?height=40&width=40",
      image: null,
    },
    {
      id: 2,
      author: "Bob",
      content: "I learned a lot, thanks!",
      avatar: "/placeholder.svg?height=40&width=40",
      image: null,
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [image, setImage] = useState(null);

  const handleUpvote = () => setUpvotes(upvotes + 1);
  const handleDownvote = () => setDownvotes(downvotes + 1);

  const handleAddComment = () => {
    if (newComment.trim() || image) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          author: "You",
          content: newComment.trim(),
          avatar: "/placeholder.svg?height=40&width=40",
          image: image,
        },
      ]);
      setNewComment("");
      setImage(null);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto ">
      <Card className=" mx-auto">
        <CardHeader className="p-0">
          <Image
            src="/images/crime.png"
            alt="Header image"
            width={600}
            height={300}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Amazing Discovery</h2>
          <p className="text-muted-foreground mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <div className="flex space-x-4 mb-6">
            <Badge
              variant="secondary"
              className="flex items-center space-x-1 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={handleUpvote}
            >
              <ArrowUp className="w-4 h-4" />
              <span>{upvotes}</span>
            </Badge>
            <Badge
              variant="secondary"
              className="flex items-center space-x-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={handleDownvote}
            >
              <ArrowDown className="w-4 h-4" />
              <span>{downvotes}</span>
            </Badge>
          </div>
          <Separator className="my-6" />
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <Avatar>
                  <AvatarImage src={comment.avatar} alt={comment.author} />
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{comment.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {comment.content}
                  </p>
                  {comment.image && (
                    <Image
                      src={comment.image}
                      alt="Uploaded"
                      width={400}
                      height={300}
                      className="mt-2 rounded-lg w-full"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col w-full space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
          <textarea
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          {image && (
            <Image
              src={image}
              alt="Preview"
              width={400}
              height={300}
              className="rounded-lg w-full"
            />
          )}
          <Button onClick={handleAddComment} className="w-full">
            Post
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
