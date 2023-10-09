import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { visit } from "unist-util-visit"
import remarkDirective from "remark-directive"
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'


export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    id: {
      type: 'string',
      description: 'The id of the post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'Short description of the post',
      required: true,
    },
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    modifiedDate: {
      type: 'date',
      description: 'The last modified date of the post',
      required: true,
    },
    category: {
      type: 'string',
      description: 'The category of the post',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
  },
}))

const prettyCodeOptions = {
  // Use one of Shiki's packaged themes
  theme: 'github-dark-dimmed',
 
  // Keep the background or use a custom background color?
  keepBackground: true,
 
  // Callback hooks to add custom logic to nodes when visiting
  // them.
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{type: 'text', value: ' '}];
    }
  },
  onVisitHighlightedLine(node) {
    // Each line node by default has `class="line"`.
    node.properties.className.push('highlighted');
  },
  onVisitHighlightedWord(node) {
    // Each word node has no className by default.
    node.properties.className = ['word'];
  },
};

// adding .anchor to link
const autolinkHeadingsOptions = {
  properties: {
    className: ['anchor'],
  },
}

// plugin for adding admonition
function remarkAdmonition() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (!["info", "warn", "danger", "weed", "mushroom"].includes(node.attributes?.class)) return

        function titleFormatter(title) {
          if (title === 'skip-title') return ''
          if (!/_/.test(title)) return title
          
          return title.replace(/_/g, ' ');
        }

        const title = titleFormatter(node.name)
        const data = node.data || (node.data = {})
        const types = node.attributes?.class
        node.type = "mdxJsxFlowElement"
        node.name = "Admonition"
        node.attributes = [{ type: "mdxJsxAttribute", name: "title", value: title }, { type: "mdxJsxAttribute", name: "types", value: types }]
      }
    })
  }
}

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  mdx: { 
    remarkPlugins: [remarkGfm, remarkDirective, remarkAdmonition, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, autolinkHeadingsOptions],
      [rehypePrettyCode, prettyCodeOptions], 
      rehypeKatex,
    ] 
  },
})