import React from "react";
import { blogs } from "@/data/blogs";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = blogs.find((b) => b.slug === slug);
    if (!blog) return {};

    return {
        title: `${blog.title} | Sking Cosmetics`,
        description: blog.metaDescription,
    };
}

const BlogDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const blog = blogs.find((b) => b.slug === slug);

    if (!blog) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <article className="pt-24 pb-20">
                {/* Hero Header */}
                <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <Link href="/blogs" className="inline-flex items-center text-sking-pink font-medium mb-8 group">
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        Back to Journal
                    </Link>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <span className="bg-sking-pink/10 text-sking-pink px-3 py-1 rounded-full font-semibold uppercase tracking-wider text-[10px]">
                            {blog.category}
                        </span>
                        <span>{blog.date}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{blog.readTime}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-8">
                        {blog.title}
                    </h1>

                    <div className="flex items-center gap-4 border-y border-gray-100 py-6">
                        <div className="w-12 h-12 bg-sking-pink/10 rounded-full flex items-center justify-center text-sking-pink font-bold text-xl">
                            {blog.author.charAt(0)}
                        </div>
                        <div>
                            <p className="text-gray-900 font-semibold">{blog.author}</p>
                            <p className="text-gray-500 text-sm">Sking Beauty Expert</p>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="prose prose-lg prose-sking max-w-none 
              prose-headings:text-gray-900 
              prose-p:text-gray-700 
              prose-strong:text-gray-900 
              prose-img:rounded-2xl"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* FAQ Section */}
                    {blog.faqs.length > 0 && (
                        <section className="mt-20 pt-16 border-t border-gray-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-10">Frequently Asked Questions</h2>
                            <div className="space-y-8">
                                {blog.faqs.map((faq, index) => (
                                    <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                                        <h4 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h4>
                                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Tags */}
                    <div className="mt-16 flex flex-wrap gap-3">
                        {blog.tags.map((tag) => (
                            <span key={tag} className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Share Section */}
                    <div className="mt-16 pt-10 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-900 font-bold uppercase tracking-wider text-sm">Share this post:</span>
                            <div className="flex gap-4">
                                {/* Social icons would go here */}
                                <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-sking-pink hover:border-sking-pink hover:text-white transition-all cursor-pointer">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z" /></svg>
                                </span>
                                <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all cursor-pointer">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </span>
                                <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all cursor-pointer">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.835 0-5.141 2.306-5.141 5.141 0 1.056.326 2.03.882 2.834L7.141 16.5l2.427-.638c.767.412 1.643.649 2.571.649 2.835 0 5.141-2.306 5.141-5.141 0-2.835-2.306-5.141-5.141-5.141zM10.516 14.223c-.149-.149-.252-.352-.252-.57 0-.444.36-.804.804-.804.218 0 .421.088.569.237.149.149.237.351.237.57 0 .444-.36.804-.804.804-.219 0-.421-.103-.57-.237zm3.179 0c-.149-.149-.237-.352-.237-.57 0-.444.36-.804.804-.804.219 0 .421.088.569.237.149.149.253.351.253.57 0 .444-.36.804-.804.804-.218 0-.42-.103-.57-.237z" /></svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Suggested Reading */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold font-sans text-gray-900 mb-4">You might also like</h2>
                            <p className="text-gray-600">Explore more articles from our beauty journal</p>
                        </div>
                        <Link href="/blogs" className="text-sking-pink font-bold border-b-2 border-sking-pink pb-1">
                            View All Posts
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.filter(b => b.slug !== slug).slice(0, 3).map((blog) => (
                            <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group block">
                                <div className="relative h-60 rounded-2xl overflow-hidden mb-6">
                                    <Image src={blog.image} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-sking-pink transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />

        </div>
    );
};

export default BlogDetailPage;
