import React, { useState, useEffect } from 'react';
import { MessageSquare, Copy, Send, Edit3, Heart, GraduationCap, Leaf, PoundSterling, MapPin, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const templateCategories = [
  {
    id: 'local-issues',
    name: 'Local Issues',
    templates: [
      {
        title: 'Housing Concerns',
        content: 'Dear [MP Name],\n\nI am writing to express my concerns about housing in our constituency...'
      },
      {
        title: 'Public Transport',
        content: 'Dear [MP Name],\n\nI would like to bring to your attention the current state of public transport services...'
      }
    ]
  },
  {
    id: 'environmental',
    name: 'Environmental Issues',
    templates: [
      {
        title: 'Green Energy',
        content: 'Dear [MP Name],\n\nI am writing regarding the development of renewable energy in our area...'
      },
      {
        title: 'Local Conservation',
        content: 'Dear [MP Name],\n\nI would like to discuss the conservation efforts in our constituency...'
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    templates: [
      {
        title: 'NHS Services',
        content: 'Dear [MP Name],\n\nI am concerned about the current state of NHS services in our area...'
      },
      {
        title: 'Mental Health Support',
        content: 'Dear [MP Name],\n\nI would like to discuss the availability of mental health services...'
      }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    templates: [
      {
        title: 'School Funding',
        content: 'Dear [MP Name],\n\nI am writing about the current state of school funding in our constituency...'
      },
      {
        title: 'Higher Education',
        content: 'Dear [MP Name],\n\nI would like to discuss access to higher education in our area...'
      }
    ]
  }
];

export function MessageTemplates() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Ready-to-Use Templates</h2>
          <p className="text-muted-foreground">
            Contact Your MP with Confidence: Use our professionally crafted message templates to
            communicate effectively about issues that matter to you and your community.
          </p>
        </div>

        <Tabs defaultValue="local-issues" className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-4">
            {templateCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {templateCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <ScrollArea className="h-[600px] rounded-md border p-4">
                <div className="grid gap-4">
                  {category.templates.map((template, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{template.title}</CardTitle>
                        <CardDescription>
                          Professional template for addressing {category.name.toLowerCase()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className="whitespace-pre-wrap text-sm">
                          {template.content}
                        </pre>
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-2">
                        <Button variant="outline">Preview</Button>
                        <Button>Use Template</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}