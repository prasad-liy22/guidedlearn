import { Sparkles, Globe, MessageSquare, Link as LinkIcon, Heart, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';    

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#020617] pt-12 md:pt-20 pb-8 md:pb-10 border-t border-slate-800/60 overflow-hidden mt-auto">
            {/* Background Glows */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full md:w-[800px] h-[300px] md:h-[400px] bg-purple-600/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-5 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">

                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4 md:mb-6 group w-fit">
                            <div className="p-2 bg-linear-to-br from-purple-600 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <span className="text-lg md:text-xl font-black text-white tracking-tight">Learning Bench</span>
                        </Link>
                        <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 font-medium">
                            The ultimate AI-powered study kit and knowledge hub for the next generation of creators and learners.
                        </p>
                        <div className="flex items-center gap-3 md:gap-4">
                            <a href="#" className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all group active:scale-95">
                                <Globe size={16} className="md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all group active:scale-95">
                                <LinkIcon size={16} className="md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-sky-400 hover:border-sky-500/50 transition-all group active:scale-95">
                                <MessageSquare size={16} className="md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs md:text-sm mb-4 md:mb-6">Platform</h4>
                        <ul className="space-y-3 md:space-y-4">
                            <li><Link to="/tools" className="text-slate-400 text-xs md:text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group w-fit"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Study Tools</Link></li>
                            <li><Link to="/blogs" className="text-slate-400 text-xs md:text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group w-fit"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Knowledge Hub</Link></li>
                            <li><Link to="/creator-registration" className="text-slate-400 text-xs md:text-sm font-medium hover:text-cyan-400 transition-colors flex items-center gap-2 group w-fit"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Become a Creator</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs md:text-sm mb-4 md:mb-6">Resources</h4>
                        <ul className="space-y-3 md:space-y-4">
                            <li>
                                <Link to="/help-center" className="text-slate-400 text-xs md:text-sm font-medium hover:text-purple-400 transition-colors w-fit block">
                                    Help Center
                                </Link>
                            </li>

                            <li>
                                <Link to="/community-guide-lines" className="text-slate-400 text-xs md:text-sm font-medium hover:text-purple-400 transition-colors w-fit block">
                                    Community Guidelines
                                </Link>
                            </li>

                            <li>
                                <Link to="/privacy-policy" className="text-slate-400 text-xs md:text-sm font-medium hover:text-purple-400 transition-colors w-fit block">
                                    Privacy Policy
                                </Link>
                            </li>

                            <li>
                                <Link to="/terms-of-service" className="text-slate-400 text-xs md:text-sm font-medium hover:text-purple-400 transition-colors w-fit block">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs md:text-sm mb-4 md:mb-6">Stay Updated</h4>
                        <p className="text-slate-400 text-xs md:text-sm mb-4 font-medium">Join our newsletter for the latest study tips and tech updates.</p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 sm:py-2.5 pl-10 pr-4 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                            </div>
                            <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-3 sm:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-colors shadow-lg shadow-cyan-600/20 active:scale-95 shrink-0">
                                Subscribe
                            </button>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800/60 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-center md:text-left">
                    <p className="text-slate-500 text-xs md:text-sm font-medium">
                        &copy; {currentYear} Learning Bench. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-xs md:text-sm font-medium flex items-center justify-center gap-1.5">
                        Built with <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500 fill-red-500 animate-pulse" /> by Room205
                    </p>
                </div>
            </div>
        </footer>
    );
}