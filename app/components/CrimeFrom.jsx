"use client";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Popover, PopoverTrigger } from "@/app/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";

export default function CrimeReportForm() {
  //const [date, setDate] = useState<Date>()
  //   const [selectedFile, setSelectedFile] = (useState < File) | (null > null);
  //   const [fileError, setFileError] = (useState < string) | (null > null);

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crime Report Form</CardTitle>
          <CardDescription>
            Please fill out this form to report a crime. All information will be
            kept confidential.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Name">Name</Label>
              <Input id="Name" placeholder="Akash" />
            </div>
            {/* <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" />
          </div> */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="mdyhakash@gmail.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="(123) 456-7890" />
          </div>
          <div className="space-y-2">
            <Label>Date of Incident</Label>
            <Popover>
              <PopoverTrigger asChild>
                {/* <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button> */}
              </PopoverTrigger>
              {/* <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent> */}
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location of Incident</Label>
            <Input id="location" placeholder="City, State, ZIP" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crimeType">Type of Crime</Label>
            <Select>
              <SelectTrigger id="crimeType">
                <SelectValue placeholder="Select crime type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="assault">Assault</SelectItem>
                <SelectItem value="burglary">Burglary</SelectItem>
                <SelectItem value="vandalism">Vandalism</SelectItem>
                <SelectItem value="fraud">Fraud</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image Upload</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              //onChange={}
            />
            {/* {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected file: {selectedFile.name}
            </p>
          )}
          {fileError && (
            <Alert variant="destructive">
              <AlertDescription>{fileError}</AlertDescription>
            </Alert>
          )} */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description of Incident</Label>
            <Textarea
              id="description"
              placeholder="Please provide a detailed description of what happened..."
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Submit Report</Button>
        </CardFooter>
      </Card>
    </>
  );
}
