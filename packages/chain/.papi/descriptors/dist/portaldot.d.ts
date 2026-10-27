import { StorageDescriptor, PlainDescriptor, TxDescriptor, RuntimeDescriptor, Enum, ApisFromDef, QueryFromPalletsDef, TxFromPalletsDef, EventsFromPalletsDef, ErrorsFromPalletsDef, ConstFromPalletsDef, ViewFnsFromPalletsDef, SS58String, SizedHex, FixedSizeArray } from "polkadot-api";
import type { I5sesotjlssv2d, Iffmde3ekjedi9, I4mddgoa69c0a2, I28ngrmftub4bu, I95g6i7ilua7lq, Ieniouoqkq4icf, Phase, Ibgl04rn6nbfm6, I4q39t5hn830vp, I3geksg000c171, BabeDigestsNextConfigDescriptor, Ic5m5lp1oioo8r, Idq7or56ds2f13, I4s6vifaf8k998, I9jd27rnpm8ttv, I8jnd4d8ip6djo, Ifip05kcrl65am, Iff9heri56m1mb, I1q8tnt1cluu5j, I8ds64oj6581v0, Ia7pdug7cdsg8g, Ie24921mrn2cu1, I762rjtdaa553f, TransactionPaymentReleases, ElectionProviderMultiPhasePhase, Ictkaqdbfabuek, Ia7o65280hur3p, Iasd2iat48n080, Ic8d01sg6acf60, Irl37q7erstrb, I8s6n43okuj2b1, Ia2lhg7l2hilo3, Ic12aht5vh2sen, StakingRewardDestination, I9o7ssi9vmhmgr, Ic3m9d6tdl6gi2, Ib3j7gb0jgs38u, Ifekshcrgkl12g, I7svnfko10tq2e, I6flrronqs3l6n, I97fulj5h3ik95, Ia8896dq44k9m4, Icgljjb6j82uhn, Iff9p3c7k6pfoi, StakingForcing, Iafq6t4rgheait, I4ojmnsk1dchql, Iinkhfdlka9ch, I2kj4j6mp68hf8, I6ouflveob4eli, I97t7vuaf93oca, I23blhbuf4rn4p, I82jm9g7pufuel, I2t2hv6jbqq8q3, Ifvqn3ldat80ai, I99bb69usss9gs, GrandpaStoredState, I7pe2me3i3vtn9, Iegmj7n48sc3am, I5eqns92ifde41, Ikjpbtmstl9nm, I5kulbesqc1h1t, I36dvimehsh2tm, I8t4pajubp34g3, I852a7otva6hbr, I23nq3fsgtejt, I4pact7n2e9a0i, I4ftk0glls7946, I910puuahutflf, I4nfjdef0ibh44, I74af64m08r6as, Ic8ann3kre6vdm, I1j72qfgdejqsv, I60biiepd74113, Ic3thpm9sv0po7, Ic2tf4aj3mjn1b, I2uej34sfsc57v, Ifble4juuml5ig, Version, Ichn934mf6rn4k, I56u24ncejr5kt, PreimageOldRequestStatus, PreimageRequestStatus, Iagromhid5fjbs, I9p9lq3rej5bhc, Iag146hmjgqfgj, I8uo3fpd3bcc6f, Ict0fmb8krq1lk, I3qklfjubrljqh, Iag3f1hum3p4c8, I4s6jkha20aoh0, I2brm5b9jij1st, I78s05f59eoi8b, I35l6p7kq19mr0, I2fb54desdqd9n, I4arjljr6dpflb, Idjett00s2gd, Ibjfaoj07vq7bm, I2jh6l2jh6e48q, I3d3qku31qb8k1, Ianufjuplcj6u4, Id32h28hjj1tch, I2mv9dvsaj3kcr, I7781vnk0rm9eq, Ie2iqtdb0stqo1, I5irutptk105do, Ic9nev69d8grv1, I18m6a0sc4k7s9, Ic9iokm15iigt6, I35m96p3u4vl0p, Iapmji0h53pmkn, Idrr42svup341f, I4ugih6gb4fmug, Idac0t49lnd4ls, I72ndo6phms8ik, I1b2ckfeib3nig, I52552vmt51a1m, Icd998p53cb80u, I2rese38jhn96u, Ic5t26f9cp3tvk, I39k39h6vu4hbq, Ibofbvvaehln4e, Idphjddn2h69vc, Idhh9vuu2bderg, If6qa32dj75gu1, I7oo2mprv1qd1s, NominationPoolsClaimPermission, I4lgr5i5qhk4i8, I2eh80qovrl7h2, Ic1h0rm1lg7jdb, I53esa2ms463bk, Idkbvh6dahk1v7, Iepbsvlk3qceij, Idrqj2ciheom9h, I704rpeu2gigqg, I27kh9vlj2hj16, I2uqrsj0afntbd, I284aa3mhslm50, I85i5336l26o5a, I3blejcb10m5c9, I4amfhnpegtv8t, I1vf976h89f2ls, Ia7varbguadod5, I5g2vv0ckl2m8b, I81fgiotlbkabs, Ifsa7722foeg4l, I6a7jeqava2tob, Iarmmkrn32a2vr, I6e7fsqs7vbr1g, I8t75ej2kqe171, Id73a6777qiav4, I47qpjdc82anud, I834nfrf667ag1, I14i9pui8lc778, I2na29tt2afp0j, I4hkhloodl7q5t, Idq3n4esn5nvc5, I3oiqcurom3m43, I20ichc5j0l1u7, I1p16diuhde12h, I1vfb3ajo1hl6k, I542q009qbgt8k, I4e5ujckjq61g8, I9055m3udr8982, Ibc0k3cev2cak7, Ibitorb47on20s, Ifmarq0v77ok, I4totqt881mlti, I76g8pnvlrcvkk, Ic994l4okqiqmh, I54ga0rrt8nrua, In7a38730s6qs, Ibtil0ss5munbk, I9s0ave7t0vnrk, I4fo08joqmcqnm, Ijc5n210o8bbf, I3m5sq54sjdlso, I35p85j063s0il, Iafqnechp3omqg, Iasb8k6ash5mjn, I8ofcg5rbj0g2c, I4adgbll7gku4i, I6pjjpfvhvcfru, I9pj91mj79qekl, I39uah9nss64h9, Ik64dknsq7k08, Ib51vk42m1po4n, I9qo50msie06h7, I9ce1pv1nr9ipb, Ib328pv185cqh5, I8ucjbjltduo5i, Ib1loc02pbmlsk, I50ppnqasq4tjq, I9fin09kkg0jaj, Idcr6u6361oad9, I666bl2fqjkejo, I1u3ac7lafvv5b, I5teebeg0opib2, I65i612een2ak, I5vvf47ira6s09, I5ns79ftlq8cnl, I59ofijoau4bjh, Ibmr18suc9ikh9, Ieka2e164ntfss, I5u8olqbbvfnvf, I5utcetro501ir, I31k9f0jol8ko4, I80q14um2s2ckg, I5qs1t1erfi7u8, I9et13knvdvgpb, I2eip8tc75dpje, I564va64vtidbq, Ie5v6njpckr05b, I328av3j0bgmjb, I4tuqm9ato907i, I19iomcbdrerea, I9dgmcnuamt5p8, I3vh014cqgmrfd, Ifhs60omlhvt3, If34udpd5e57vi, I39t01nnod9109, Ie5vbnd9198quk, I3h6murn8bd4v5, I6k6jf8ncesuu3, I6rqcpg80db1fb, If1qr0kbbl298c, Idl3umm12u5pa, I5ont0141q9ss5, Ie6j49utvii126, I3v6ks33uluhnj, I3kiiim1cds68i, I4k60mkh2r6jjg, Ic5njrpnvi3f8g, I8gh566he1q1pj, I38jfk5li8iang, Iaiigoa73v0ioa, Iepde6nson5v8u, I2dtrijkm5601t, I2ev73t79f46tb, Ib2obgji960euh, Icu8seopr711dn, Id09aqt1ca773l, I3c63j6sh3evqn, I79cmnv5q6b3p, I7ne83r38c2sqq, I2hviml3snvhhn, I7fcl4aua07ato, Icm9m0qeemu66d, I7t3arsaa2siad, Ies1efup9f14ih, Iunnigs2ph8da, I1vll9s18sd1u7, I3otc7e9a35k1k, I89ier5tb9ne0s, Im2f0numhevg3, I9ck7gf792i8am, I8vgdndamv46s3, I83fv0vi59md7i, I5tjjqcdd4tae0, I1894dm1lf1ae7, Idcpp47q096b5p, I83css7r9mhvr6, Idf1fcqa0qi2nt, I73kffnn32g4c7, I2kds5jji7slh8, Ia9mkdf6l44shb, I9l2s4klu0831o, I2ctrt5nqb8o7c, I711qahikocb1c, Id6gojh30v9ib2, I9h4cqmadpj7l0, If31vrl50nund3, I29bkdd7n16li1, I9jb9hqm18runn, I85htvo8b885h, I13n219aci2a5j, I7umt3f08lvkah, Ie5l999tf7t2te, I7boamina3ienb, I7j1atkng1ju6n, I25ve5d3dgicmv, Ia647qc1v1kokt, I3usr0jpt8ovnk, I5a5fh6anhjgu7, Ict9ivhr2c5hv0, Ia5huiefjr1uhk, I8tcieak2iq2al, I5n4sebgkfr760, Ibrdskthpj262p, Ifs1i5fk9cqvr6, Iciqis70karta1, Ibmq6pc54e6cek, Ieg3fd8p4pkt10, I8kg5ll427kfqq, I467333262q1l9, I82nfqfkd48n10, I1jm8m1rh9e20v, I3o5j3bli1pd8e, If5vi4jv15uth, I115185tv1dn0m, I3uo1p0na0591a, Ifm2adqhk6cqgf, Idj9faf6hgsdur, I8mj1nm903hpts, Idmrdqtsttau2s, I9s2nog40v0irr, I3684usfj6e9tu, Ideaemvoneh309, I3d9o9d7epp66v, I6lqh1vgb4mcja, I2a839vbf5817q, Ia9p5bg6p18r0i, I5rlb1eesbovji, Ia96ru6pujbas0, I90n6nnkpdahrh, I666l8bn65t664, Iacnh1j2d6i0uf, Ic5b47dj4coa3r, Iblqeltiorjs7a, I387qicsot8ouv, I46pqbe97377ff, Iepglv06nn5df, I1ihtj6h55990a, Idc2iadgettsjf, I2vkvak51mm9ip, I8hff7chabggkd, I49i39mtj1ivbs, Ia38uhc66c5pu8, I2rqp0be9dgvpp, I8ehtmbkpthnh1, I58fkujvj9jskn, I7l28cs1blokb5, I9vl5kpk0fpakt, I717jt61hu19b4, I6luketh4mshm4, Idjrs24gh0qv5l, I3pirohb0sp3ic, Iemqna2uucuei9, Idrvp50hbkv2k2, Ie11u326g2gsj3, Iacbtv7bdkku2a, Ibmailvl2rk94u, I4b3viebhsqj08, I223jg78mng8hq, I8o0ghd9j8csrc, Idlch5fvavr8mh, I94er5fkmhi69n, If9vko7pv0231m, Iafkqus0ohh6l6, I6cu7obfo0rr0o, Idoicaqddtcrv0, I7pl01hchcjac6, I9q6srh8o2jnej, I2787020350fc3, I20n7o3khlu75i, I5tvvgui05tn6e, Ibal0joadvdc2h, Iceq9fmmp9aeqv, I9viqhmdtuof5e, Ibqooroq6rr5kr, I6h88h8vba22v8, I5g8c5alradibo, I19jiel1ftbcce, I29lgqtck418gp, Iecq2mm321jdg3, I77ie723ncd4co, I76l9e2pop152r, Ib7ed2pe1b1sg, I1ahf3pvgsgbu, I9kjcceihn9imm, I1esmt123kmgt3, I97qcg6i3l8gee, Idpvdjolib1gd, I1jj31tn29ie3c, I5llu6o6a0go5i, Ic8b8561e6t9ie, I93r2effh7od84, I3qq76irbr2fol, Icrkms46uh8tpb, I78u60nqh0etah, I1lso3vlgherue, I26c8p47106toa, Iq82b3qvf20ne, Ic3j8ku6mbsms4, I3nvoqsi8f05ph, I4dr6q8duftm2l, I4da75oqso1rqj, I8otu439cqo7jl, I7562ikckoa9b7, Itrlf5b2o2l8q, I4vj3ndsquheo1, I7h5kud22qmfsg, Iepvl96j3rpblo, Iems2cb8v3lka8, I4oh0ds0hgt386, I8mk5kjgn02hi8, I5onpf3u0obsqb, I2gr10p66od9ch, I5d9an59q96b9e, Ieg1oc56mamrl5, I2vu5vj7173ik9, Id70c5vciftf2i, I36uoc8t9liv80, I9iq45aekjq7kb, I26ne2mpnrbqa5, I9tlpr80ot76ta, I47a2tsd2o2b1c, Ifc9k1s0e9nv8e, I4ihj26hl75e5p, I2dl8ekhm2t22h, I13us5e5h5645o, I931cottvong90, Ic4h0nvtu79ch6, I1ors0vru14it3, I40s11r8nagn2g, I6bjj87fr5g9nl, I8cbluptqo8kbp, I81cc4plffa1dm, I3ihan8icf0c5k, I7aouqn0g9m7gc, Ibot63dbdh2glr, I159idlqohsibn, Iakc63ljp5po9a, Id3g8b5i00okmf, I4te2k2l2kne4q, I2dgughrdjdpcj, Ied3h58e6qlrmv, I9j0ul7nh7b8jv, Ierp7e8nj861eo, Ibgvds6gf6dbmm, Iba7pefg0d11kh, I2pjehun5ehh5i, I1ssp78ejl639m, Ibou4u1engb441, Id6nbvqoqdj4o2, I95iqep3b8snn9, I4v4jc8ak5c8j7, Ieifvmse8ekofd, Iepja8rcbuaao2, I10gda06ia6n74, I6bqnueuk5semj, I268qbbcqfpqi0, Iaiqv5prlisjkg, Ia3ebg5qshpkmr, Iagnp6gsiemekd, I2uc90glvkisre, I7tcaqpipfe64i, I6eqlfpqd4sp3a, Ib2n01qni7h5uk, Idscf6boak49q1, I4s60s3v5pfj6u, Ibtsa3docbr9el, I629ak383ovl28, I5cuv5a5cclsfd, Ie3qk84fi8j51k, I6td68h84ru5u7, Ickqtr6vqgluk1, Ihqcf8k5b8c95, Idehabrqi23sc0, I2knvr4mp5k6t3, I8jl7pfcvfu3kv, Ida37oe44osb06, I6v02o6j4snahe, I27569neuh5t1o, Id92o6smntb9m5, I5nmb2hfkgk9ol, Iav55bcqlrqn51, Iqrtlsfd2lcbm, I10ra4g1rl6k2f, I1uihehkdsggvp, I9gel4bv68gacj, I4758mvfui73ro, I6gq6p3sibtpsu, I71dqiv5kjda2b, I5tr07eeku900u, I5653fv7gatldu, I9bg8aubpi9e76, I4hq1n8ejhmk2j, I8g22bn83j942k, Ibatn98n08e7sr, I37r4bdai8o9mp, I6k09ktco8uiuf, I3bmm0aglg28l9, Ic56ti7uem2814, Ia82mnkmeo2rhc, I638akia269ogg, Icbccs0ug47ilf, I855j4i3kr8ko1, I1qjrksp5d26rv, Idks0m2do620u9, Ievr39qp5f2qfn, I4e8ijo7sp17m7, I174g6ev4gb80t, Ia1u3jll6a06ae, Ic9g5lvl9iddc5, Icv68aq8841478, Ic262ibdoec56a, Iflcfm9b6nlmdd, Ijrsf4mnp3eka, Id5fm4p8lj5qgi, I8tjvj9uq4b7hi, I3qt1hgg4djhgb, I4cbvqmqadhrea, I4fooe9dun9o0t, I8ikjg47gad5qs, Ieetn6hi5s8es8, I7cq8k0l21g5rb, Iph9c4rn81ub2, Ier2cke86dqbr2, Icjn9u0mv2cnn4, Icjchvrijclvlv, I4mol6k10mv0io, Iec90vukseit9e, I7j4m7a3pkvsf4, Ic2n50kpnu5mae, I1au3fq4n84nv3, Iejaj7m7qka9tr, Idnak900lt5lm8, I27n7lbd66730p, I2hq50pu2kdjpo, Ifk8eme5o7mukf, Iau4cgm6ih61cf, Ith132hqfb27q, Ic19as7nbst738, I54umskavgc9du, I2ip7o9e2tc5sf, I5egvk6hadac5h, I1td4upnup9gqv, I9acqruh7322g2, Ift6f10887nk72, I7qc53b1tvqjg2, I9dbtdtj06jbrc, Iak7fhrgb9jnnq, I9ad1o9mv4cm3, I5768ac424h061, I8iksqi3eani0a, I16enopmju1p0q, I43kq8qudg7pq9, I76riseemre533, I38bmcrmh852rk, I4hcillge8de5f, I97u3kqqqkf4si, Iasudo93amopi2, Ie5222qfrr24ek, I28g8sphdu312k, Idqbjt2c6r46t6, I853aigjva3f0t, I9uehhems5hkqm, I7q5qk4uoanhof, Iehpbs40l3jkit, Idht9upmipvd4j, I7png4ljr2t3ad, I5rtkmhm2dng4u, I6niuoceqveh04, Iksn90easbs68, I2bhk17btucdqn, I85icj2qbjeqbe, Iep1lmt6q3s6r3, I1fac16213rie2, Ifjt77oc391o43, Itvt1jsipv0lc, Ick3mveut33f44, I719lqkkbtikbl, Ie4intrc3n8jfu, I2rg5btjrsqec0, Ibdqerrooruuq9, I8u2ba9jeiu6q0, I7ieadb293k6b4, I74cgu8np39n0l, I25orvb54q88dl, Ib729ncvntj6ge, Icsmfeouh6gri7, Icj1c576oljupp, I2c8c7v4oadht4, I6v43d5vj613hc, I5nf2t4nnfae4i, Ih04jp733tqqa, Ievr89968437gm, I5o687olbd097v, Ia3c82eadg79bj, Ienusoeb625ftq, I39lfgq5bja17p, I6vrp2049vcgir, I2ur0oeqg495j8, I3g2abs6vce9f8, I1bhd210c3phjj, Iep27ialq4a7o7, Iasu5jvoqr43mv, I62e0di1bmjcu8, I5qolde99acmd1, I8gtde5abn1g9a, Id9idaj83175f9, Ie1semicfuv5uu, If25fjs9o37co1, I70sc1pdo8vtos, Ibck5e4jpm96l8, I88ff3u4dpivk, I33cp947glv1ks, Ic9om1gmmqu7rq, I5hfov2b68ppb6, Ibthhb2m9vneds, Iaitn5bqfacj7k, If4ebvclj2ugvi, Ia5le7udkgbaq9, Ieduc1e6frq8rb, I9h6gbtabovtm4, Ifnsa0dkkpf465, I65dtqr2egjbc3, Ibqj3vg5s5lk0c, I6l73u513p8rna, Iefqmt2htu1dlu, If8bgtgqrchjtu, Idusmq77988cmt, Ifhs6ggbuiec5i, Id2vo4qi5agnp0, Idtfinpnsamten, I455dk0vr5anih, I9gqanbbbe917p, Id1m1230297f7a, Ifvb1p5munhhv4, I46h83ilqeed3g, Icahse3uoi76n7, I75sj3uv7gnemk, I5fjkvcb5vr6nb, I2gr1toekv86b9, I2v2ikqt2trp52, If3057hi1g5qlo, Iaii5qf41d5n3d, Ico8bnjc6taa27, I78i1bvlonei69, I9i1f9mrso1hmf, I9ksla2si91s56, Id9j7b85otvjru, Iaihk9pek2ajl9, Id9av23h47ufb2, Ib4kpnijas4jqp, I2vnu5k0u1i65h, Ib67harsthtcvr, Ic7ok3lq0728f7, I66jdpl6lile9j, I2i8iea6e4ne1j, I4jotama61aldv, I3rfugj0vt1ug5, I37454vatvmm1l, Iblau1qa7u7fet, I60p8l86a8cm59, I3m3sk2lgcabvp, I5pf572duh4oeg, Icr6lg11cpe563, I1ti389kf8t6oi, If4nnre373amul, I55kbor0ocqk6h, Idsj9cg7j96kpc, Ido4u9drncfaml, Ie8c7ctks8ur2p, I6c6fpqmnqijqd, I6mik29s5073td, I2m0sqmb75cnpb, I49agc5b62mehu, Iatq9jda4hq6pg, I2g87evcjlgmqi, I93ajn7brqs8df, Ib2q8vnsr19t9b, If6q1q7op2gvqf, I5okq99a5mhve0, Ibtl2buofcs39i, I359nvpbbb5v0e, I8t31d95clla6j, Ifcsperb0j354i, Ideuk4ni7h8umc, I2amf0mdkaugme, Ic0he9tlf9ll0u, Id77b899o0q565, Iauaqn31cdv3v5, I132u4k70mlo2, I9a6c60esvi342, I20e9ph536u7ti, I8kcpmsh450rp, I3ft01m2okqsq2, If1co0pilmi7oq, Iae74gjak1qibn, I3escdojpj0551, Iaf2rbm5li8ck4, Ib118uuss8au5p, Idfdoi7vpo971s, Icjdv7ehtt4mjk, I7fa966sr93enr, Icinrphfs7c1gh, Ib27rtfpnn4vta, If5j64blk6vsus, Ich62oku3ck3iu, Idj7j1g3t3rr57, Ickukqupg34u5t, I9l243q1j0e2us, I44ckreh9i933v, I2o3evaj5726u9, I201plm6irk5mk, Idmeitgo0fl3id, I7dkrdcvab1juf, If5tfto9lepmm8, Ifla9c8bp7r3l9, Im8dpq6bqg07f, I5mulkk8c7che3, I9cne53h7vg3o3, Id1mft8cuf1k15, I9hhtv8ta7cn20, I86lj2lvai0jjp, I5i213pqldjng, I7svbvm6hg57aj, I8jhsbaiultviu, I920ueqv7have, Id2aanom2jncf1, Iae6ufqp41dfob, I805fjumfh5lp2, I41bt7lr6c2cqa, Icp7uk05kec03m, I18495m62cpsjo, I1hl2lumftiuhm, I32klqpv3q0cp4, Idn2ghub1o4i40, Imk0evl51eusg, Iehnbl33s6kgkm, Iej1vlcdhgkpe, Ibon7bp75ufg1e, Iatlpqusbd4df2, Ictkqqlhdjt761, Ie2db4l6126rkt, I4sut8eue4ivos, Ifl19kf0ds243k, Ihfphjolmsqq1, I1bpip5bh5877p, I6052turo9tavh, Iemk0s5gdc9ruv, Iba6ec6u9n2dc1, I9q7jcg05t1hem, I9vodnt2k1kha, I4ao1le27fcisl, Itom7fk49o0c9, Ih4ursllob8fg, I974rv7q5bvln8, I7oh7gneaur84, Iaqet9jc3ihboe, Ic952bubvq4k7d, I2v50gu3s1aqk6, Iabpgqcjikia83, I4gil44d08grh, I7u915mvkdsb08, Icscp8b58b21dm, If7uv525tdvv7a, I2an1fs2eiebjp, TransactionValidityTransactionSource, I9ask1o4tfvcvs, I9puqgoda8ofk4, Iems84l8lk2v0c, I1r5ke30ueqo0r, I68ii5ik8avr9o, I53vj2e4msforp, If9jidduiuq7vv, Ic9sg38spglsac, I9sijb8gfrns29, Ifjj5cmoh609on, I2dfliekq1ed7e, Idi8peb5lpo0e3, I9u22scd4ksrjm, I6spmpef2c7svf, Iei2mvq0mjvt81, I5vv5n03oo8gas, Ifogo2hpqpe6b4, Ifiofttj73fsk1, I25plekc1moieu, I3eao7ea0kppv8, I7rj2bnb76oko1, I4o356o7eq06ms, I46e127tr8ma2h, Irtu011t0fjnh, I38ee9is0n4jn9, Ie88mmnuvmuvp5, Idp7c8fe2gno1b, I2q4hkchnhgjdq, I4ph3d1eepnmr1, Icerf8h8pdu8ss, If4oj302humfb5, Ie9sr1iqcg3cgm, I1mqgk2tmnn9i2, I6lr8sctk0bi4e, Ibt0lihobh9n50, I9ignf80plhtp3, I6f9v7emp7t5ba, Ida7d8eqrkav55, I9mq0s1ommikm5, I2806mq9p1klk7, Iau1ib3fio8i01, I5pr7ru7k4ujjt, Ift65j5o2ie116, I5r43bh3m67flj, Idkcb4p19k6ugl, I182b5tlke1q67, Id22r0gklsr0ok, I512dtcl0pn07c, I2ec37pbcqq1ro, I4dgtkhmhiffkf, Ibgnf8no4mn5ud, Ibf1s6i393v4p3, I6ndsf1m9crheh, I4hnd166aeftfc, Ie7st2ejf0s7p7, I443q2eobpl1oo, Iemjikdfnke6fr, I37m8k9k51pj9s, Ia685ab8s4usht, I22ecnhcr9cmso, I5bdp74m07b0eb, I1qo9nd5q94bfi, Ic0l56ij40lma0, Iful5cbgvctt9u, Iavvurav4044cq, Ib49a5bg3lsb8k, Iadsikp5ionsgv, Icgjgvpjeeblbi, Idgc44jj42ek3d, Iru6diprdsqp8, I7ddmu7ej0lg1q, Ifipqnuto78ql4, If3pcbgmbe0gqe, I933ji9qe9nc1k, I7h0upq0njhdnu, Iabdqtqo5t5boh, Icpmie0rdcstlj, I1au3n925eptkb, ExtensionsCheckMortality, I4oqfks1952m1e, I87rnrnks7g0hm, I4joek0d1bbeb } from "./common-types";
type AnonymousEnum<T extends {}> = T & {
    __anonymous: true;
};
type MyTuple<T> = [T, ...T[]];
type SeparateUndefined<T> = undefined extends T ? undefined | Exclude<T, undefined> : T;
type Anonymize<T> = SeparateUndefined<T extends string | number | bigint | boolean | void | undefined | null | symbol | Uint8Array | Enum<any> ? T : T extends AnonymousEnum<infer V> ? Enum<V> : T extends MyTuple<any> ? {
    [K in keyof T]: T[K];
} : T extends [] ? [] : T extends FixedSizeArray<infer L, infer T> ? number extends L ? Array<T> : FixedSizeArray<L, T> : {
    [K in keyof T & string]: T[K];
}>;
type IStorage = {
    System: {
        /**
         * The full account information for a particular account ID.
         */
        Account: StorageDescriptor<[Key: SS58String], Anonymize<I5sesotjlssv2d>, false, never>;
        /**
         * Total extrinsics count for the current block.
         */
        ExtrinsicCount: StorageDescriptor<[], number, true, never>;
        /**
         * Whether all inherents have been applied.
         */
        InherentsApplied: StorageDescriptor<[], boolean, false, never>;
        /**
         * The current weight for the block.
         */
        BlockWeight: StorageDescriptor<[], Anonymize<Iffmde3ekjedi9>, false, never>;
        /**
         * Total size (in bytes) of the current block.
         *
         * Tracks the size of the header and all extrinsics.
         */
        BlockSize: StorageDescriptor<[], number, true, never>;
        /**
         * Map of block numbers to block hashes.
         */
        BlockHash: StorageDescriptor<[Key: number], SizedHex<32>, false, never>;
        /**
         * Extrinsics data for the current block (maps an extrinsic's index to its data).
         */
        ExtrinsicData: StorageDescriptor<[Key: number], Uint8Array, false, never>;
        /**
         * The current block number being processed. Set by `execute_block`.
         */
        Number: StorageDescriptor<[], number, false, never>;
        /**
         * Hash of the previous block.
         */
        ParentHash: StorageDescriptor<[], SizedHex<32>, false, never>;
        /**
         * Digest of the current block, also part of the block header.
         */
        Digest: StorageDescriptor<[], Anonymize<I4mddgoa69c0a2>, false, never>;
        /**
         * Events deposited for the current block.
         *
         * NOTE: The item is unbound and should therefore never be read on chain.
         * It could otherwise inflate the PoV size of a block.
         *
         * Events have a large in-memory size. Box the events to not go out-of-memory
         * just in case someone still reads them from within the runtime.
         */
        Events: StorageDescriptor<[], Anonymize<I28ngrmftub4bu>, false, never>;
        /**
         * The number of events in the `Events<T>` list.
         */
        EventCount: StorageDescriptor<[], number, false, never>;
        /**
         * Mapping between a topic (represented by T::Hash) and a vector of indexes
         * of events in the `<Events<T>>` list.
         *
         * All topic vectors have deterministic storage locations depending on the topic. This
         * allows light-clients to leverage the changes trie storage tracking mechanism and
         * in case of changes fetch the list of events of interest.
         *
         * The value has the type `(BlockNumberFor<T>, EventIndex)` because if we used only just
         * the `EventIndex` then in case if the topic has the same contents on the next block
         * no notification will be triggered thus the event might be lost.
         */
        EventTopics: StorageDescriptor<[Key: SizedHex<32>], Anonymize<I95g6i7ilua7lq>, false, never>;
        /**
         * Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.
         */
        LastRuntimeUpgrade: StorageDescriptor<[], Anonymize<Ieniouoqkq4icf>, true, never>;
        /**
         * Number of blocks till the pending code upgrade is applied.
         */
        BlocksTillUpgrade: StorageDescriptor<[], number, true, never>;
        /**
         * True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.
         */
        UpgradedToU32RefCount: StorageDescriptor<[], boolean, false, never>;
        /**
         * True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
         * (default) if not.
         */
        UpgradedToTripleRefCount: StorageDescriptor<[], boolean, false, never>;
        /**
         * The execution phase of the block.
         */
        ExecutionPhase: StorageDescriptor<[], Phase, true, never>;
        /**
         * `Some` if a code upgrade has been authorized.
         */
        AuthorizedUpgrade: StorageDescriptor<[], Anonymize<Ibgl04rn6nbfm6>, true, never>;
        /**
         * The weight reclaimed for the extrinsic.
         *
         * This information is available until the end of the extrinsic execution.
         * More precisely this information is removed in `note_applied_extrinsic`.
         *
         * Logic doing some post dispatch weight reduction must update this storage to avoid duplicate
         * reduction.
         */
        ExtrinsicWeightReclaimed: StorageDescriptor<[], Anonymize<I4q39t5hn830vp>, false, never>;
    };
    Babe: {
        /**
         * Current epoch index.
         */
        EpochIndex: StorageDescriptor<[], bigint, false, never>;
        /**
         * Current epoch authorities.
         */
        Authorities: StorageDescriptor<[], Anonymize<I3geksg000c171>, false, never>;
        /**
         * The slot at which the first epoch actually started. This is 0
         * until the first block of the chain.
         */
        GenesisSlot: StorageDescriptor<[], bigint, false, never>;
        /**
         * Current slot number.
         */
        CurrentSlot: StorageDescriptor<[], bigint, false, never>;
        /**
         * The epoch randomness for the *current* epoch.
         *
         * # Security
         *
         * This MUST NOT be used for gambling, as it can be influenced by a
         * malicious validator in the short term. It MAY be used in many
         * cryptographic protocols, however, so long as one remembers that this
         * (like everything else on-chain) it is public. For example, it can be
         * used where a number is needed that cannot have been chosen by an
         * adversary, for purposes such as public-coin zero-knowledge proofs.
         */
        Randomness: StorageDescriptor<[], SizedHex<32>, false, never>;
        /**
         * Pending epoch configuration change that will be applied when the next epoch is enacted.
         */
        PendingEpochConfigChange: StorageDescriptor<[], BabeDigestsNextConfigDescriptor, true, never>;
        /**
         * Next epoch randomness.
         */
        NextRandomness: StorageDescriptor<[], SizedHex<32>, false, never>;
        /**
         * Next epoch authorities.
         */
        NextAuthorities: StorageDescriptor<[], Anonymize<I3geksg000c171>, false, never>;
        /**
         * Randomness under construction.
         *
         * We make a trade-off between storage accesses and list length.
         * We store the under-construction randomness in segments of up to
         * `UNDER_CONSTRUCTION_SEGMENT_LENGTH`.
         *
         * Once a segment reaches this length, we begin the next one.
         * We reset all segments and return to `0` at the beginning of every
         * epoch.
         */
        SegmentIndex: StorageDescriptor<[], number, false, never>;
        /**
         * TWOX-NOTE: `SegmentIndex` is an increasing integer, so this is okay.
         */
        UnderConstruction: StorageDescriptor<[Key: number], Anonymize<Ic5m5lp1oioo8r>, false, never>;
        /**
         * Temporary value (cleared at block finalization) which is `Some`
         * if per-block initialization has already been called for current block.
         */
        Initialized: StorageDescriptor<[], Anonymize<Idq7or56ds2f13>, true, never>;
        /**
         * This field should always be populated during block processing unless
         * secondary plain slots are enabled (which don't contain a VRF output).
         *
         * It is set in `on_finalize`, before it will contain the value from the last block.
         */
        AuthorVrfRandomness: StorageDescriptor<[], Anonymize<I4s6vifaf8k998>, false, never>;
        /**
         * The block numbers when the last and current epoch have started, respectively `N-1` and
         * `N`.
         * NOTE: We track this is in order to annotate the block number when a given pool of
         * entropy was fixed (i.e. it was known to chain observers). Since epochs are defined in
         * slots, which may be skipped, the block numbers may not line up with the slot numbers.
         */
        EpochStart: StorageDescriptor<[], Anonymize<I9jd27rnpm8ttv>, false, never>;
        /**
         * How late the current block is compared to its parent.
         *
         * This entry is populated as part of block execution and is cleaned up
         * on block finalization. Querying this storage entry outside of block
         * execution context should always yield zero.
         */
        Lateness: StorageDescriptor<[], number, false, never>;
        /**
         * The configuration for the current epoch. Should never be `None` as it is initialized in
         * genesis.
         */
        EpochConfig: StorageDescriptor<[], Anonymize<I8jnd4d8ip6djo>, true, never>;
        /**
         * The configuration for the next epoch, `None` if the config will not change
         * (you can fallback to `EpochConfig` instead in that case).
         */
        NextEpochConfig: StorageDescriptor<[], Anonymize<I8jnd4d8ip6djo>, true, never>;
        /**
         * A list of the last 100 skipped epochs and the corresponding session index
         * when the epoch was skipped.
         *
         * This is only used for validating equivocation proofs. An equivocation proof
         * must contains a key-ownership proof for a given session, therefore we need a
         * way to tie together sessions and epoch indices, i.e. we need to validate that
         * a validator was the owner of a given key on a given session, and what the
         * active epoch index was during that session.
         */
        SkippedEpochs: StorageDescriptor<[], Anonymize<Ifip05kcrl65am>, false, never>;
    };
    Timestamp: {
        /**
         * The current time for the current block.
         */
        Now: StorageDescriptor<[], bigint, false, never>;
        /**
         * Whether the timestamp has been updated in this block.
         *
         * This value is updated to `true` upon successful submission of a timestamp by a node.
         * It is then checked at the end of each block execution in the `on_finalize` hook.
         */
        DidUpdate: StorageDescriptor<[], boolean, false, never>;
    };
    Authorship: {
        /**
         * Author of current block.
         */
        Author: StorageDescriptor<[], SS58String, true, never>;
    };
    Indices: {
        /**
         * The lookup from index to account.
         */
        Accounts: StorageDescriptor<[Key: number], Anonymize<Iff9heri56m1mb>, true, never>;
    };
    Balances: {
        /**
         * The total units issued in the system.
         */
        TotalIssuance: StorageDescriptor<[], bigint, false, never>;
        /**
         * The total units of outstanding deactivated balance in the system.
         */
        InactiveIssuance: StorageDescriptor<[], bigint, false, never>;
        /**
         * The Balances pallet example of storing the balance of an account.
         *
         * # Example
         *
         * ```nocompile
         * impl pallet_balances::Config for Runtime {
         * type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
         * }
         * ```
         *
         * You can also store the balance of an account in the `System` pallet.
         *
         * # Example
         *
         * ```nocompile
         * impl pallet_balances::Config for Runtime {
         * type AccountStore = System
         * }
         * ```
         *
         * But this comes with tradeoffs, storing account balances in the system pallet stores
         * `frame_system` data alongside the account data contrary to storing account balances in the
         * `Balances` pallet, which uses a `StorageMap` to store balances data only.
         * NOTE: This is only used in the case that this pallet is used to store balances.
         */
        Account: StorageDescriptor<[Key: SS58String], Anonymize<I1q8tnt1cluu5j>, false, never>;
        /**
         * Any liquidity locks on some account balances.
         * NOTE: Should only be accessed when setting, changing and freeing a lock.
         *
         * Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
         */
        Locks: StorageDescriptor<[Key: SS58String], Anonymize<I8ds64oj6581v0>, false, never>;
        /**
         * Named reserves on some account balances.
         *
         * Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
         */
        Reserves: StorageDescriptor<[Key: SS58String], Anonymize<Ia7pdug7cdsg8g>, false, never>;
        /**
         * Holds on account balances.
         */
        Holds: StorageDescriptor<[Key: SS58String], Anonymize<Ie24921mrn2cu1>, false, never>;
        /**
         * Freeze locks on account balances.
         */
        Freezes: StorageDescriptor<[Key: SS58String], Anonymize<I762rjtdaa553f>, false, never>;
    };
    TransactionPayment: {
        /**
        
         */
        NextFeeMultiplier: StorageDescriptor<[], bigint, false, never>;
        /**
        
         */
        StorageVersion: StorageDescriptor<[], TransactionPaymentReleases, false, never>;
        /**
         * The `OnChargeTransaction` stores the withdrawn tx fee here.
         *
         * Use `withdraw_txfee` and `remaining_txfee` to access from outside the crate.
         */
        TxPaymentCredit: StorageDescriptor<[], bigint, true, never>;
    };
    ElectionProviderMultiPhase: {
        /**
         * Internal counter for the number of rounds.
         *
         * This is useful for de-duplication of transactions submitted to the pool, and general
         * diagnostics of the pallet.
         *
         * This is merely incremented once per every time that an upstream `elect` is called.
         */
        Round: StorageDescriptor<[], number, false, never>;
        /**
         * Current phase.
         */
        CurrentPhase: StorageDescriptor<[], ElectionProviderMultiPhasePhase, false, never>;
        /**
         * Current best solution, signed or unsigned, queued to be returned upon `elect`.
         *
         * Always sorted by score.
         */
        QueuedSolution: StorageDescriptor<[], Anonymize<Ictkaqdbfabuek>, true, never>;
        /**
         * Snapshot data of the round.
         *
         * This is created at the beginning of the signed phase and cleared upon calling `elect`.
         * Note: This storage type must only be mutated through [`SnapshotWrapper`].
         */
        Snapshot: StorageDescriptor<[], Anonymize<Ia7o65280hur3p>, true, never>;
        /**
         * Desired number of targets to elect for this round.
         *
         * Only exists when [`Snapshot`] is present.
         * Note: This storage type must only be mutated through [`SnapshotWrapper`].
         */
        DesiredTargets: StorageDescriptor<[], number, true, never>;
        /**
         * The metadata of the [`RoundSnapshot`]
         *
         * Only exists when [`Snapshot`] is present.
         * Note: This storage type must only be mutated through [`SnapshotWrapper`].
         */
        SnapshotMetadata: StorageDescriptor<[], Anonymize<Iasd2iat48n080>, true, never>;
        /**
         * The next index to be assigned to an incoming signed submission.
         *
         * Every accepted submission is assigned a unique index; that index is bound to that particular
         * submission for the duration of the election. On election finalization, the next index is
         * reset to 0.
         *
         * We can't just use `SignedSubmissionIndices.len()`, because that's a bounded set; past its
         * capacity, it will simply saturate. We can't just iterate over `SignedSubmissionsMap`,
         * because iteration is slow. Instead, we store the value here.
         */
        SignedSubmissionNextIndex: StorageDescriptor<[], number, false, never>;
        /**
         * A sorted, bounded vector of `(score, block_number, index)`, where each `index` points to a
         * value in `SignedSubmissions`.
         *
         * We never need to process more than a single signed submission at a time. Signed submissions
         * can be quite large, so we're willing to pay the cost of multiple database accesses to access
         * them one at a time instead of reading and decoding all of them at once.
         */
        SignedSubmissionIndices: StorageDescriptor<[], Anonymize<Ic8d01sg6acf60>, false, never>;
        /**
         * Unchecked, signed solutions.
         *
         * Together with `SubmissionIndices`, this stores a bounded set of `SignedSubmissions` while
         * allowing us to keep only a single one in memory at a time.
         *
         * Twox note: the key of the map is an auto-incrementing index which users cannot inspect or
         * affect; we shouldn't need a cryptographically secure hasher.
         */
        SignedSubmissionsMap: StorageDescriptor<[Key: number], Anonymize<Irl37q7erstrb>, true, never>;
        /**
         * The minimum score that each 'untrusted' solution must attain in order to be considered
         * feasible.
         *
         * Can be set via `set_minimum_untrusted_score`.
         */
        MinimumUntrustedScore: StorageDescriptor<[], Anonymize<I8s6n43okuj2b1>, true, never>;
    };
    Staking: {
        /**
         * The ideal number of active validators.
         */
        ValidatorCount: StorageDescriptor<[], number, false, never>;
        /**
         * Minimum number of staking participants before emergency conditions are imposed.
         */
        MinimumValidatorCount: StorageDescriptor<[], number, false, never>;
        /**
         * Any validators that may never be slashed or forcibly kicked. It's a Vec since they're
         * easy to initialize and the performance hit is minimal (we expect no more than four
         * invulnerables) and restricted to testnets.
         */
        Invulnerables: StorageDescriptor<[], Anonymize<Ia2lhg7l2hilo3>, false, never>;
        /**
         * Map from all locked "stash" accounts to the controller account.
         *
         * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
         */
        Bonded: StorageDescriptor<[Key: SS58String], SS58String, true, never>;
        /**
         * The minimum active bond to become and maintain the role of a nominator.
         */
        MinNominatorBond: StorageDescriptor<[], bigint, false, never>;
        /**
         * The minimum active bond to become and maintain the role of a validator.
         */
        MinValidatorBond: StorageDescriptor<[], bigint, false, never>;
        /**
         * The minimum active nominator stake of the last successful election.
         */
        MinimumActiveStake: StorageDescriptor<[], bigint, false, never>;
        /**
         * The minimum amount of commission that validators can set.
         *
         * If set to `0`, no limit exists.
         */
        MinCommission: StorageDescriptor<[], number, false, never>;
        /**
         * Map from all (unlocked) "controller" accounts to the info regarding the staking.
         *
         * Note: All the reads and mutations to this storage *MUST* be done through the methods exposed
         * by [`StakingLedger`] to ensure data and lock consistency.
         */
        Ledger: StorageDescriptor<[Key: SS58String], Anonymize<Ic12aht5vh2sen>, true, never>;
        /**
         * Where the reward payment should be made. Keyed by stash.
         *
         * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
         */
        Payee: StorageDescriptor<[Key: SS58String], StakingRewardDestination, true, never>;
        /**
         * The map from (wannabe) validator stash key to the preferences of that validator.
         *
         * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
         */
        Validators: StorageDescriptor<[Key: SS58String], Anonymize<I9o7ssi9vmhmgr>, false, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForValidators: StorageDescriptor<[], number, false, never>;
        /**
         * The maximum validator count before we stop allowing new validators to join.
         *
         * When this value is not set, no limits are enforced.
         */
        MaxValidatorsCount: StorageDescriptor<[], number, true, never>;
        /**
         * The map from nominator stash key to their nomination preferences, namely the validators that
         * they wish to support.
         *
         * Note that the keys of this storage map might become non-decodable in case the
         * account's [`NominationsQuota::MaxNominations`] configuration is decreased.
         * In this rare case, these nominators
         * are still existent in storage, their key is correct and retrievable (i.e. `contains_key`
         * indicates that they exist), but their value cannot be decoded. Therefore, the non-decodable
         * nominators will effectively not-exist, until they re-submit their preferences such that it
         * is within the bounds of the newly set `Config::MaxNominations`.
         *
         * This implies that `::iter_keys().count()` and `::iter().count()` might return different
         * values for this map. Moreover, the main `::count()` is aligned with the former, namely the
         * number of keys that exist.
         *
         * Lastly, if any of the nominators become non-decodable, they can be chilled immediately via
         * [`Call::chill_other`] dispatchable by anyone.
         *
         * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
         */
        Nominators: StorageDescriptor<[Key: SS58String], Anonymize<Ic3m9d6tdl6gi2>, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForNominators: StorageDescriptor<[], number, false, never>;
        /**
         * Stakers whose funds are managed by other pallets.
         *
         * This pallet does not apply any locks on them, therefore they are only virtually bonded. They
         * are expected to be keyless accounts and hence should not be allowed to mutate their ledger
         * directly via this pallet. Instead, these accounts are managed by other pallets and accessed
         * via low level apis. We keep track of them to do minimal integrity checks.
         */
        VirtualStakers: StorageDescriptor<[Key: SS58String], null, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForVirtualStakers: StorageDescriptor<[], number, false, never>;
        /**
         * The maximum nominator count before we stop allowing new validators to join.
         *
         * When this value is not set, no limits are enforced.
         */
        MaxNominatorsCount: StorageDescriptor<[], number, true, never>;
        /**
         * The current era index.
         *
         * This is the latest planned era, depending on how the Session pallet queues the validator
         * set, it might be active or not.
         */
        CurrentEra: StorageDescriptor<[], number, true, never>;
        /**
         * The active era information, it holds index and start.
         *
         * The active era is the era being currently rewarded. Validator set of this era must be
         * equal to [`SessionInterface::validators`].
         */
        ActiveEra: StorageDescriptor<[], Anonymize<Ib3j7gb0jgs38u>, true, never>;
        /**
         * The session index at which the era start for the last [`Config::HistoryDepth`] eras.
         *
         * Note: This tracks the starting session (i.e. session index when era start being active)
         * for the eras in `[CurrentEra - HISTORY_DEPTH, CurrentEra]`.
         */
        ErasStartSessionIndex: StorageDescriptor<[Key: number], number, true, never>;
        /**
         * Exposure of validator at era.
         *
         * This is keyed first by the era index to allow bulk deletion and then the stash account.
         *
         * Is it removed after [`Config::HistoryDepth`] eras.
         * If stakers hasn't been set or has been removed then empty exposure is returned.
         *
         * Note: Deprecated since v14. Use `EraInfo` instead to work with exposures.
         */
        ErasStakers: StorageDescriptor<Anonymize<I7svnfko10tq2e>, Anonymize<Ifekshcrgkl12g>, false, never>;
        /**
         * Summary of validator exposure at a given era.
         *
         * This contains the total stake in support of the validator and their own stake. In addition,
         * it can also be used to get the number of nominators backing this validator and the number of
         * exposure pages they are divided into. The page count is useful to determine the number of
         * pages of rewards that needs to be claimed.
         *
         * This is keyed first by the era index to allow bulk deletion and then the stash account.
         * Should only be accessed through `EraInfo`.
         *
         * Is it removed after [`Config::HistoryDepth`] eras.
         * If stakers hasn't been set or has been removed then empty overview is returned.
         */
        ErasStakersOverview: StorageDescriptor<Anonymize<I7svnfko10tq2e>, Anonymize<I6flrronqs3l6n>, true, never>;
        /**
         * Clipped Exposure of validator at era.
         *
         * Note: This is deprecated, should be used as read-only and will be removed in the future.
         * New `Exposure`s are stored in a paged manner in `ErasStakersPaged` instead.
         *
         * This is similar to [`ErasStakers`] but number of nominators exposed is reduced to the
         * `T::MaxExposurePageSize` biggest stakers.
         * (Note: the field `total` and `own` of the exposure remains unchanged).
         * This is used to limit the i/o cost for the nominator payout.
         *
         * This is keyed fist by the era index to allow bulk deletion and then the stash account.
         *
         * It is removed after [`Config::HistoryDepth`] eras.
         * If stakers hasn't been set or has been removed then empty exposure is returned.
         *
         * Note: Deprecated since v14. Use `EraInfo` instead to work with exposures.
         */
        ErasStakersClipped: StorageDescriptor<Anonymize<I7svnfko10tq2e>, Anonymize<Ifekshcrgkl12g>, false, never>;
        /**
         * Paginated exposure of a validator at given era.
         *
         * This is keyed first by the era index to allow bulk deletion, then stash account and finally
         * the page. Should only be accessed through `EraInfo`.
         *
         * This is cleared after [`Config::HistoryDepth`] eras.
         */
        ErasStakersPaged: StorageDescriptor<Anonymize<Ia8896dq44k9m4>, Anonymize<I97fulj5h3ik95>, true, never>;
        /**
         * History of claimed paged rewards by era and validator.
         *
         * This is keyed by era and validator stash which maps to the set of page indexes which have
         * been claimed.
         *
         * It is removed after [`Config::HistoryDepth`] eras.
         */
        ClaimedRewards: StorageDescriptor<Anonymize<I7svnfko10tq2e>, Anonymize<Icgljjb6j82uhn>, false, never>;
        /**
         * Similar to `ErasStakers`, this holds the preferences of validators.
         *
         * This is keyed first by the era index to allow bulk deletion and then the stash account.
         *
         * Is it removed after [`Config::HistoryDepth`] eras.
         */
        ErasValidatorPrefs: StorageDescriptor<Anonymize<I7svnfko10tq2e>, Anonymize<I9o7ssi9vmhmgr>, false, never>;
        /**
         * The total validator era payout for the last [`Config::HistoryDepth`] eras.
         *
         * Eras that haven't finished yet or has been removed doesn't have reward.
         */
        ErasValidatorReward: StorageDescriptor<[Key: number], bigint, true, never>;
        /**
         * Rewards for the last [`Config::HistoryDepth`] eras.
         * If reward hasn't been set or has been removed then 0 reward is returned.
         */
        ErasRewardPoints: StorageDescriptor<[Key: number], Anonymize<Iff9p3c7k6pfoi>, false, never>;
        /**
         * The total amount staked for the last [`Config::HistoryDepth`] eras.
         * If total hasn't been set or has been removed then 0 stake is returned.
         */
        ErasTotalStake: StorageDescriptor<[Key: number], bigint, false, never>;
        /**
         * Mode of era forcing.
         */
        ForceEra: StorageDescriptor<[], StakingForcing, false, never>;
        /**
         * Maximum staked rewards, i.e. the percentage of the era inflation that
         * is used for stake rewards.
         * See [Era payout](./index.html#era-payout).
         */
        MaxStakedRewards: StorageDescriptor<[], number, true, never>;
        /**
         * The percentage of the slash that is distributed to reporters.
         *
         * The rest of the slashed value is handled by the `Slash`.
         */
        SlashRewardFraction: StorageDescriptor<[], number, false, never>;
        /**
         * The amount of currency given to reporters of a slash event which was
         * canceled by extraordinary circumstances (e.g. governance).
         */
        CanceledSlashPayout: StorageDescriptor<[], bigint, false, never>;
        /**
         * All unapplied slashes that are queued for later.
         */
        UnappliedSlashes: StorageDescriptor<[Key: number], Anonymize<Iafq6t4rgheait>, false, never>;
        /**
         * A mapping from still-bonded eras to the first session index of that era.
         *
         * Must contains information for eras for the range:
         * `[active_era - bounding_duration; active_era]`
         */
        BondedEras: StorageDescriptor<[], Anonymize<I95g6i7ilua7lq>, false, never>;
        /**
         * All slashing events on validators, mapped by era to the highest slash proportion
         * and slash value of the era.
         */
        ValidatorSlashInEra: StorageDescriptor<Anonymize<I7svnfko10tq2e>, Anonymize<I4ojmnsk1dchql>, true, never>;
        /**
         * All slashing events on nominators, mapped by era to the highest slash value of the era.
         */
        NominatorSlashInEra: StorageDescriptor<Anonymize<I7svnfko10tq2e>, bigint, true, never>;
        /**
         * Slashing spans for stash accounts.
         */
        SlashingSpans: StorageDescriptor<[Key: SS58String], Anonymize<Iinkhfdlka9ch>, true, never>;
        /**
         * Records information about the maximum slash of a stash within a slashing span,
         * as well as how much reward has been paid out.
         */
        SpanSlash: StorageDescriptor<[Key: Anonymize<I6ouflveob4eli>], Anonymize<I2kj4j6mp68hf8>, false, never>;
        /**
         * The last planned session scheduled by the session pallet.
         *
         * This is basically in sync with the call to [`pallet_session::SessionManager::new_session`].
         */
        CurrentPlannedSession: StorageDescriptor<[], number, false, never>;
        /**
         * The threshold for when users can start calling `chill_other` for other validators /
         * nominators. The threshold is compared to the actual number of validators / nominators
         * (`CountFor*`) in the system compared to the configured max (`Max*Count`).
         */
        ChillThreshold: StorageDescriptor<[], number, true, never>;
    };
    Session: {
        /**
         * The current set of validators.
         */
        Validators: StorageDescriptor<[], Anonymize<Ia2lhg7l2hilo3>, false, never>;
        /**
         * Current index of the session.
         */
        CurrentIndex: StorageDescriptor<[], number, false, never>;
        /**
         * True if the underlying economic identities or weighting behind the validators
         * has changed in the queued validator set.
         */
        QueuedChanged: StorageDescriptor<[], boolean, false, never>;
        /**
         * The queued keys for the next session. When the next session begins, these keys
         * will be used to determine the validator's session keys.
         */
        QueuedKeys: StorageDescriptor<[], Anonymize<I97t7vuaf93oca>, false, never>;
        /**
         * Indices of disabled validators.
         *
         * The vec is always kept sorted so that we can find whether a given validator is
         * disabled using binary search. It gets cleared when `on_session_ending` returns
         * a new set of identities.
         */
        DisabledValidators: StorageDescriptor<[], Anonymize<I95g6i7ilua7lq>, false, never>;
        /**
         * The next session keys for a validator.
         */
        NextKeys: StorageDescriptor<[Key: SS58String], Anonymize<I23blhbuf4rn4p>, true, never>;
        /**
         * The owner of a key. The key is the `KeyTypeId` + the encoded key.
         */
        KeyOwner: StorageDescriptor<[Key: Anonymize<I82jm9g7pufuel>], SS58String, true, never>;
        /**
         * Accounts whose keys were set via `SessionInterface` (external path) without
         * incrementing the consumer reference or placing a key deposit. `do_purge_keys`
         * only decrements consumers for accounts that were registered through the local
         * session pallet.
         */
        ExternallySetKeys: StorageDescriptor<[Key: SS58String], null, true, never>;
    };
    TechnicalCommittee: {
        /**
         * The hashes of the active proposals.
         */
        Proposals: StorageDescriptor<[], Anonymize<Ic5m5lp1oioo8r>, false, never>;
        /**
         * Actual proposal for a given hash, if it's current.
         */
        ProposalOf: StorageDescriptor<[Key: SizedHex<32>], Anonymize<I2t2hv6jbqq8q3>, true, never>;
        /**
         * Consideration cost created for publishing and storing a proposal.
         *
         * Determined by [Config::Consideration] and may be not present for certain proposals (e.g. if
         * the proposal count at the time of creation was below threshold N).
         */
        CostOf: StorageDescriptor<[Key: SizedHex<32>], Anonymize<Ifvqn3ldat80ai>, true, never>;
        /**
         * Votes on a given proposal, if it is ongoing.
         */
        Voting: StorageDescriptor<[Key: SizedHex<32>], Anonymize<I99bb69usss9gs>, true, never>;
        /**
         * Proposals so far.
         */
        ProposalCount: StorageDescriptor<[], number, false, never>;
        /**
         * The current members of the collective. This is stored sorted (just by value).
         */
        Members: StorageDescriptor<[], Anonymize<Ia2lhg7l2hilo3>, false, never>;
        /**
         * The prime member that helps determine the default vote behavior in case of abstentions.
         */
        Prime: StorageDescriptor<[], SS58String, true, never>;
    };
    TechnicalMembership: {
        /**
         * The current membership, stored as an ordered Vec.
         */
        Members: StorageDescriptor<[], Anonymize<Ia2lhg7l2hilo3>, false, never>;
        /**
         * The current prime member, if one exists.
         */
        Prime: StorageDescriptor<[], SS58String, true, never>;
    };
    Grandpa: {
        /**
         * State of the current authority set.
         */
        State: StorageDescriptor<[], GrandpaStoredState, false, never>;
        /**
         * Pending change: (signaled at, scheduled change).
         */
        PendingChange: StorageDescriptor<[], Anonymize<I7pe2me3i3vtn9>, true, never>;
        /**
         * next block number where we can force a change.
         */
        NextForced: StorageDescriptor<[], number, true, never>;
        /**
         * `true` if we are currently stalled.
         */
        Stalled: StorageDescriptor<[], Anonymize<I9jd27rnpm8ttv>, true, never>;
        /**
         * The number of changes (both in terms of keys and underlying economic responsibilities)
         * in the "set" of Grandpa validators from genesis.
         */
        CurrentSetId: StorageDescriptor<[], bigint, false, never>;
        /**
         * A mapping from grandpa set ID to the index of the *most recent* session for which its
         * members were responsible.
         *
         * This is only used for validating equivocation proofs. An equivocation proof must
         * contains a key-ownership proof for a given session, therefore we need a way to tie
         * together sessions and GRANDPA set ids, i.e. we need to validate that a validator
         * was the owner of a given key on a given session, and what the active set ID was
         * during that session.
         *
         * TWOX-NOTE: `SetId` is not under user control.
         */
        SetIdSession: StorageDescriptor<[Key: bigint], number, true, never>;
        /**
         * The current list of authorities.
         */
        Authorities: StorageDescriptor<[], Anonymize<I3geksg000c171>, false, never>;
    };
    Treasury: {
        /**
         * DEPRECATED: associated with `spend_local` call and will be removed in May 2025.
         * Refer to <https://github.com/paritytech/polkadot-sdk/pull/5961> for migration to `spend`.
         *
         * Number of proposals that have been made.
         */
        ProposalCount: StorageDescriptor<[], number, false, never>;
        /**
         * DEPRECATED: associated with `spend_local` call and will be removed in May 2025.
         * Refer to <https://github.com/paritytech/polkadot-sdk/pull/5961> for migration to `spend`.
         *
         * Proposals that have been made.
         */
        Proposals: StorageDescriptor<[Key: number], Anonymize<Iegmj7n48sc3am>, true, never>;
        /**
         * The amount which has been reported as inactive to Currency.
         */
        Deactivated: StorageDescriptor<[], bigint, false, never>;
        /**
         * DEPRECATED: associated with `spend_local` call and will be removed in May 2025.
         * Refer to <https://github.com/paritytech/polkadot-sdk/pull/5961> for migration to `spend`.
         *
         * Proposal indices that have been approved but not yet awarded.
         */
        Approvals: StorageDescriptor<[], Anonymize<Icgljjb6j82uhn>, false, never>;
        /**
         * The count of spends that have been made.
         */
        SpendCount: StorageDescriptor<[], number, false, never>;
        /**
         * Spends that have been approved and being processed.
         */
        Spends: StorageDescriptor<[Key: number], Anonymize<I5eqns92ifde41>, true, never>;
        /**
         * The blocknumber for the last triggered spend period.
         */
        LastSpendPeriod: StorageDescriptor<[], number, true, never>;
    };
    AssetRate: {
        /**
         * Maps an asset to its fixed point representation in the native balance.
         *
         * E.g. `native_amount = asset_amount * ConversionRateToNative::<T>::get(asset_kind)`
         */
        ConversionRateToNative: StorageDescriptor<[Key: Anonymize<Ikjpbtmstl9nm>], bigint, true, never>;
    };
    Contracts: {
        /**
         * A mapping from a contract's code hash to its code.
         */
        PristineCode: StorageDescriptor<[Key: SizedHex<32>], Uint8Array, true, never>;
        /**
         * A mapping from a contract's code hash to its code info.
         */
        CodeInfoOf: StorageDescriptor<[Key: SizedHex<32>], Anonymize<I5kulbesqc1h1t>, true, never>;
        /**
         * This is a **monotonic** counter incremented on contract instantiation.
         *
         * This is used in order to generate unique trie ids for contracts.
         * The trie id of a new contract is calculated from hash(account_id, nonce).
         * The nonce is required because otherwise the following sequence would lead to
         * a possible collision of storage:
         *
         * 1. Create a new contract.
         * 2. Terminate the contract.
         * 3. Immediately recreate the contract with the same account_id.
         *
         * This is bad because the contents of a trie are deleted lazily and there might be
         * storage of the old instantiation still in it when the new contract is created. Please
         * note that we can't replace the counter by the block number because the sequence above
         * can happen in the same block. We also can't keep the account counter in memory only
         * because storage is the only way to communicate across different extrinsics in the
         * same block.
         *
         * # Note
         *
         * Do not use it to determine the number of contracts. It won't be decremented if
         * a contract is destroyed.
         */
        Nonce: StorageDescriptor<[], bigint, false, never>;
        /**
         * The code associated with a given account.
         *
         * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
         */
        ContractInfoOf: StorageDescriptor<[Key: SS58String], Anonymize<I36dvimehsh2tm>, true, never>;
        /**
         * Evicted contracts that await child trie deletion.
         *
         * Child trie deletion is a heavy operation depending on the amount of storage items
         * stored in said trie. Therefore this operation is performed lazily in `on_idle`.
         */
        DeletionQueue: StorageDescriptor<[Key: number], Uint8Array, true, never>;
        /**
         * A pair of monotonic counters used to track the latest contract marked for deletion
         * and the latest deleted contract in queue.
         */
        DeletionQueueCounter: StorageDescriptor<[], Anonymize<I8t4pajubp34g3>, false, never>;
        /**
         * A migration can span across multiple blocks. This storage defines a cursor to track the
         * progress of the migration, enabling us to resume from the last completed position.
         */
        MigrationInProgress: StorageDescriptor<[], Uint8Array, true, never>;
    };
    Sudo: {
        /**
         * The `AccountId` of the sudo key.
         */
        Key: StorageDescriptor<[], SS58String, true, never>;
    };
    ImOnline: {
        /**
         * The block number after which it's ok to send heartbeats in the current
         * session.
         *
         * At the beginning of each session we set this to a value that should fall
         * roughly in the middle of the session duration. The idea is to first wait for
         * the validators to produce a block in the current session, so that the
         * heartbeat later on will not be necessary.
         *
         * This value will only be used as a fallback if we fail to get a proper session
         * progress estimate from `NextSessionRotation`, as those estimates should be
         * more accurate then the value we calculate for `HeartbeatAfter`.
         */
        HeartbeatAfter: StorageDescriptor<[], number, false, never>;
        /**
         * The current set of keys that may issue a heartbeat.
         */
        Keys: StorageDescriptor<[], Anonymize<Ic5m5lp1oioo8r>, false, never>;
        /**
         * For each session index, we keep a mapping of `SessionIndex` and `AuthIndex`.
         */
        ReceivedHeartbeats: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, boolean, true, never>;
        /**
         * For each session index, we keep a mapping of `ValidatorId<T>` to the
         * number of blocks authored by the given authority.
         */
        AuthoredBlocks: StorageDescriptor<Anonymize<I7svnfko10tq2e>, number, false, never>;
    };
    AuthorityDiscovery: {
        /**
         * Keys of the current authority set.
         */
        Keys: StorageDescriptor<[], Anonymize<Ic5m5lp1oioo8r>, false, never>;
        /**
         * Keys of the next authority set.
         */
        NextKeys: StorageDescriptor<[], Anonymize<Ic5m5lp1oioo8r>, false, never>;
    };
    Offences: {
        /**
         * The primary structure that holds all offence records keyed by report identifiers.
         */
        Reports: StorageDescriptor<[Key: SizedHex<32>], Anonymize<I852a7otva6hbr>, true, never>;
        /**
         * A vector of reports of the same kind that happened at the same time slot.
         */
        ConcurrentReportsIndex: StorageDescriptor<Anonymize<I23nq3fsgtejt>, Anonymize<Ic5m5lp1oioo8r>, false, never>;
    };
    Historical: {
        /**
         * Mapping from historical session indices to session-data root hash and validator count.
         */
        HistoricalSessions: StorageDescriptor<[Key: number], Anonymize<I4pact7n2e9a0i>, true, never>;
        /**
         * The range of historical sessions we store. [first, last)
         */
        StoredRange: StorageDescriptor<[], Anonymize<I9jd27rnpm8ttv>, true, never>;
    };
    Identity: {
        /**
         * Information that is pertinent to identify the entity behind an account. First item is the
         * registration, second is the account's primary username.
         *
         * TWOX-NOTE: OK ― `AccountId` is a secure hash.
         */
        IdentityOf: StorageDescriptor<[Key: SS58String], Anonymize<I4ftk0glls7946>, true, never>;
        /**
         * Identifies the primary username of an account.
         */
        UsernameOf: StorageDescriptor<[Key: SS58String], Uint8Array, true, never>;
        /**
         * The super-identity of an alternative "sub" identity together with its name, within that
         * context. If the account is not some other account's sub-identity, then just `None`.
         */
        SuperOf: StorageDescriptor<[Key: SS58String], Anonymize<I910puuahutflf>, true, never>;
        /**
         * Alternative "sub" identities of this account.
         *
         * The first item is the deposit, the second is a vector of the accounts.
         *
         * TWOX-NOTE: OK ― `AccountId` is a secure hash.
         */
        SubsOf: StorageDescriptor<[Key: SS58String], Anonymize<I4nfjdef0ibh44>, false, never>;
        /**
         * The set of registrars. Not expected to get very big as can only be added through a
         * special origin (likely a council motion).
         *
         * The index into this can be cast to `RegistrarIndex` to get a valid value.
         */
        Registrars: StorageDescriptor<[], Anonymize<I74af64m08r6as>, false, never>;
        /**
         * A map of the accounts who are authorized to grant usernames.
         */
        AuthorityOf: StorageDescriptor<[Key: Uint8Array], Anonymize<Ic8ann3kre6vdm>, true, never>;
        /**
         * Reverse lookup from `username` to the `AccountId` that has registered it and the provider of
         * the username. The `owner` value should be a key in the `UsernameOf` map, but it may not if
         * the user has cleared their username or it has been removed.
         *
         * Multiple usernames may map to the same `AccountId`, but `UsernameOf` will only map to one
         * primary username.
         */
        UsernameInfoOf: StorageDescriptor<[Key: Uint8Array], Anonymize<I1j72qfgdejqsv>, true, never>;
        /**
         * Usernames that an authority has granted, but that the account controller has not confirmed
         * that they want it. Used primarily in cases where the `AccountId` cannot provide a signature
         * because they are a pure proxy, multisig, etc. In order to confirm it, they should call
         * [accept_username](`Call::accept_username`).
         *
         * First tuple item is the account and second is the acceptance deadline.
         */
        PendingUsernames: StorageDescriptor<[Key: Uint8Array], Anonymize<I60biiepd74113>, true, never>;
        /**
         * Usernames for which the authority that granted them has started the removal process by
         * unbinding them. Each unbinding username maps to its grace period expiry, which is the first
         * block in which the username could be deleted through a
         * [remove_username](`Call::remove_username`) call.
         */
        UnbindingUsernames: StorageDescriptor<[Key: Uint8Array], number, true, never>;
    };
    Recovery: {
        /**
         * The friend groups of an account that can conduct recovery attempts.
         *
         * Modifying this storage is not possible while an account has ongoing recovery attempts.
         */
        FriendGroups: StorageDescriptor<[Key: SS58String], Anonymize<Ic3thpm9sv0po7>, true, never>;
        /**
         * Ongoing recovery attempts of a lost account indexed by `(lost, friend_group)`.
         */
        Attempt: StorageDescriptor<Anonymize<I6ouflveob4eli>, Anonymize<Ic2tf4aj3mjn1b>, true, never>;
        /**
         * The account that inherited full access to a lost account after successful recovery.
         *
         * The key is the lost account and the value is the inheritor account.
         *
         * NOTE: This could be a multisig or proxy account
         */
        Inheritor: StorageDescriptor<[Key: SS58String], Anonymize<I2uej34sfsc57v>, true, never>;
    };
    Vesting: {
        /**
         * Information regarding the vesting of a given account.
         */
        Vesting: StorageDescriptor<[Key: SS58String], Anonymize<Ifble4juuml5ig>, true, never>;
        /**
         * Storage version of the pallet.
         *
         * New networks start with latest version, as determined by the genesis build.
         */
        StorageVersion: StorageDescriptor<[], Version, false, never>;
    };
    Scheduler: {
        /**
         * Block number at which the agenda began incomplete execution.
         */
        IncompleteSince: StorageDescriptor<[], number, true, never>;
        /**
         * Items to be executed, indexed by the block number that they should be executed on.
         */
        Agenda: StorageDescriptor<[Key: number], Anonymize<Ichn934mf6rn4k>, false, never>;
        /**
         * Retry configurations for items to be executed, indexed by task address.
         */
        Retries: StorageDescriptor<[Key: Anonymize<I9jd27rnpm8ttv>], Anonymize<I56u24ncejr5kt>, true, never>;
        /**
         * Lookup from a name to the block number and index of the task.
         *
         * For v3 -> v4 the previously unbounded identities are Blake2-256 hashed to form the v4
         * identities.
         */
        Lookup: StorageDescriptor<[Key: SizedHex<32>], Anonymize<I9jd27rnpm8ttv>, true, never>;
    };
    Preimage: {
        /**
         * The request status of a given hash.
         */
        StatusFor: StorageDescriptor<[Key: SizedHex<32>], PreimageOldRequestStatus, true, never>;
        /**
         * The request status of a given hash.
         */
        RequestStatusFor: StorageDescriptor<[Key: SizedHex<32>], PreimageRequestStatus, true, never>;
        /**
        
         */
        PreimageFor: StorageDescriptor<[Key: Anonymize<I4pact7n2e9a0i>], Uint8Array, true, never>;
    };
    Proxy: {
        /**
         * The set of account proxies. Maps the account which has delegated to the accounts
         * which are being delegated to, together with the amount held on deposit.
         */
        Proxies: StorageDescriptor<[Key: SS58String], Anonymize<Iagromhid5fjbs>, false, never>;
        /**
         * The announcements made by the proxy (key).
         */
        Announcements: StorageDescriptor<[Key: SS58String], Anonymize<I9p9lq3rej5bhc>, false, never>;
    };
    Multisig: {
        /**
         * The set of open multisig operations.
         */
        Multisigs: StorageDescriptor<Anonymize<I8uo3fpd3bcc6f>, Anonymize<Iag146hmjgqfgj>, true, never>;
    };
    Bounties: {
        /**
         * Number of bounty proposals that have been made.
         */
        BountyCount: StorageDescriptor<[], number, false, never>;
        /**
         * Bounties that have been made.
         */
        Bounties: StorageDescriptor<[Key: number], Anonymize<Ict0fmb8krq1lk>, true, never>;
        /**
         * The description of each bounty.
         */
        BountyDescriptions: StorageDescriptor<[Key: number], Uint8Array, true, never>;
        /**
         * Bounty indices that have been approved but not yet funded.
         */
        BountyApprovals: StorageDescriptor<[], Anonymize<Icgljjb6j82uhn>, false, never>;
    };
    Assets: {
        /**
         * Details of an asset.
         */
        Asset: StorageDescriptor<[Key: number], Anonymize<I3qklfjubrljqh>, true, never>;
        /**
         * The holdings of a specific account for a specific asset.
         */
        Account: StorageDescriptor<Anonymize<I7svnfko10tq2e>, Anonymize<Iag3f1hum3p4c8>, true, never>;
        /**
         * Approved balance transfers. First balance is the amount approved for transfer. Second
         * is the amount of `T::Currency` reserved for storing this.
         * First key is the asset ID, second key is the owner and third key is the delegate.
         */
        Approvals: StorageDescriptor<Anonymize<I2brm5b9jij1st>, Anonymize<I4s6jkha20aoh0>, true, never>;
        /**
         * Metadata of an asset.
         */
        Metadata: StorageDescriptor<[Key: number], Anonymize<I78s05f59eoi8b>, false, never>;
        /**
         * Maps an asset to a list of its configured reserve information.
         */
        Reserves: StorageDescriptor<[Key: number], Anonymize<I35l6p7kq19mr0>, false, never>;
        /**
         * The asset ID enforced for the next asset creation, if any present. Otherwise, this storage
         * item has no effect.
         *
         * Only read by [`crate::AutoIncAssetId`]: configure it as [`Config::AssetIdAllocator`] and
         * provide an initial value here to apply an auto-increment model to all new asset IDs.
         *
         * The initial next asset ID can be set using the [`GenesisConfig`] or the
         * [SetNextAssetId](`migration::next_asset_id::SetNextAssetId`) migration.
         */
        NextAssetId: StorageDescriptor<[], number, true, never>;
    };
    PoolAssets: {
        /**
         * Details of an asset.
         */
        Asset: StorageDescriptor<[Key: number], Anonymize<I3qklfjubrljqh>, true, never>;
        /**
         * The holdings of a specific account for a specific asset.
         */
        Account: StorageDescriptor<Anonymize<I7svnfko10tq2e>, Anonymize<Iag3f1hum3p4c8>, true, never>;
        /**
         * Approved balance transfers. First balance is the amount approved for transfer. Second
         * is the amount of `T::Currency` reserved for storing this.
         * First key is the asset ID, second key is the owner and third key is the delegate.
         */
        Approvals: StorageDescriptor<Anonymize<I2brm5b9jij1st>, Anonymize<I4s6jkha20aoh0>, true, never>;
        /**
         * Metadata of an asset.
         */
        Metadata: StorageDescriptor<[Key: number], Anonymize<I78s05f59eoi8b>, false, never>;
        /**
         * Maps an asset to a list of its configured reserve information.
         */
        Reserves: StorageDescriptor<[Key: number], Anonymize<I35l6p7kq19mr0>, false, never>;
        /**
         * The asset ID enforced for the next asset creation, if any present. Otherwise, this storage
         * item has no effect.
         *
         * Only read by [`crate::AutoIncAssetId`]: configure it as [`Config::AssetIdAllocator`] and
         * provide an initial value here to apply an auto-increment model to all new asset IDs.
         *
         * The initial next asset ID can be set using the [`GenesisConfig`] or the
         * [SetNextAssetId](`migration::next_asset_id::SetNextAssetId`) migration.
         */
        NextAssetId: StorageDescriptor<[], number, true, never>;
    };
    Beefy: {
        /**
         * The current authorities set
         */
        Authorities: StorageDescriptor<[], Anonymize<I2fb54desdqd9n>, false, never>;
        /**
         * The current validator set id
         */
        ValidatorSetId: StorageDescriptor<[], bigint, false, never>;
        /**
         * Authorities set scheduled to be used with the next session
         */
        NextAuthorities: StorageDescriptor<[], Anonymize<I2fb54desdqd9n>, false, never>;
        /**
         * A mapping from BEEFY set ID to the index of the *most recent* session for which its
         * members were responsible.
         *
         * This is only used for validating equivocation proofs. An equivocation proof must
         * contains a key-ownership proof for a given session, therefore we need a way to tie
         * together sessions and BEEFY set ids, i.e. we need to validate that a validator
         * was the owner of a given key on a given session, and what the active set ID was
         * during that session.
         *
         * TWOX-NOTE: `ValidatorSetId` is not under user control.
         */
        SetIdSession: StorageDescriptor<[Key: bigint], number, true, never>;
        /**
         * Block number where BEEFY consensus is enabled/started.
         * By changing this (through privileged `set_new_genesis()`), BEEFY consensus is effectively
         * restarted from the newly set block number.
         */
        GenesisBlock: StorageDescriptor<[], Anonymize<I4arjljr6dpflb>, false, never>;
    };
    Mmr: {
        /**
         * Latest MMR Root hash.
         */
        RootHash: StorageDescriptor<[], SizedHex<32>, false, never>;
        /**
         * Current size of the MMR (number of leaves).
         */
        NumberOfLeaves: StorageDescriptor<[], bigint, false, never>;
        /**
         * Hashes of the nodes in the MMR.
         *
         * Note this collection only contains MMR peaks, the inner nodes (and leaves)
         * are pruned and only stored in the Offchain DB.
         */
        Nodes: StorageDescriptor<[Key: bigint], SizedHex<32>, true, never>;
    };
    MmrLeaf: {
        /**
         * Details of current BEEFY authority set.
         */
        BeefyAuthorities: StorageDescriptor<[], Anonymize<Idjett00s2gd>, false, never>;
        /**
         * Details of next BEEFY authority set.
         *
         * This storage entry is used as cache for calls to `update_beefy_next_authority_set`.
         */
        BeefyNextAuthorities: StorageDescriptor<[], Anonymize<Idjett00s2gd>, false, never>;
    };
    Lottery: {
        /**
        
         */
        LotteryIndex: StorageDescriptor<[], number, false, never>;
        /**
         * The configuration for the current lottery.
         */
        Lottery: StorageDescriptor<[], Anonymize<Ibjfaoj07vq7bm>, true, never>;
        /**
         * Users who have purchased a ticket. (Lottery Index, Tickets Purchased)
         */
        Participants: StorageDescriptor<[Key: SS58String], Anonymize<I2jh6l2jh6e48q>, false, never>;
        /**
         * Total number of tickets sold.
         */
        TicketsCount: StorageDescriptor<[], number, false, never>;
        /**
         * Each ticket's owner.
         *
         * May have residual storage from previous lotteries. Use `TicketsCount` to see which ones
         * are actually valid ticket mappings.
         */
        Tickets: StorageDescriptor<[Key: number], SS58String, true, never>;
        /**
         * The calls stored in this pallet to be used in an active lottery if configured
         * by `Config::ValidateCall`.
         */
        CallIndices: StorageDescriptor<[], Anonymize<I3d3qku31qb8k1>, false, never>;
    };
    Uniques: {
        /**
         * Details of a collection.
         */
        Class: StorageDescriptor<[Key: number], Anonymize<Ianufjuplcj6u4>, true, never>;
        /**
         * The collection, if any, of which an account is willing to take ownership.
         */
        OwnershipAcceptance: StorageDescriptor<[Key: SS58String], number, true, never>;
        /**
         * The items held by any given account; set out this way so that items owned by a single
         * account can be enumerated.
         */
        Account: StorageDescriptor<Anonymize<Id32h28hjj1tch>, null, true, never>;
        /**
         * The collections owned by any given account; set out this way so that collections owned by
         * a single account can be enumerated.
         */
        ClassAccount: StorageDescriptor<Anonymize<I6ouflveob4eli>, null, true, never>;
        /**
         * The items in existence and their ownership details.
         */
        Asset: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<I2mv9dvsaj3kcr>, true, never>;
        /**
         * Metadata of a collection.
         */
        ClassMetadataOf: StorageDescriptor<[Key: number], Anonymize<I7781vnk0rm9eq>, true, never>;
        /**
         * Metadata of an item.
         */
        InstanceMetadataOf: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<I7781vnk0rm9eq>, true, never>;
        /**
         * Attributes of a collection.
         */
        Attribute: StorageDescriptor<Anonymize<I5irutptk105do>, Anonymize<Ie2iqtdb0stqo1>, true, never>;
        /**
         * Price of an asset instance.
         */
        ItemPriceOf: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<Ic9nev69d8grv1>, true, never>;
        /**
         * Keeps track of the number of items a collection might have.
         */
        CollectionMaxSupply: StorageDescriptor<[Key: number], number, true, never>;
    };
    Nfts: {
        /**
         * Details of a collection.
         */
        Collection: StorageDescriptor<[Key: number], Anonymize<I18m6a0sc4k7s9>, true, never>;
        /**
         * The collection, if any, of which an account is willing to take ownership.
         */
        OwnershipAcceptance: StorageDescriptor<[Key: SS58String], number, true, never>;
        /**
         * The items held by any given account; set out this way so that items owned by a single
         * account can be enumerated.
         */
        Account: StorageDescriptor<Anonymize<Id32h28hjj1tch>, null, true, never>;
        /**
         * The collections owned by any given account; set out this way so that collections owned by
         * a single account can be enumerated.
         */
        CollectionAccount: StorageDescriptor<Anonymize<I6ouflveob4eli>, null, true, never>;
        /**
         * The items in existence and their ownership details.
         * Stores collection roles as per account.
         */
        CollectionRoleOf: StorageDescriptor<Anonymize<I7svnfko10tq2e>, number, true, never>;
        /**
         * The items in existence and their ownership details.
         */
        Item: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<Ic9iokm15iigt6>, true, never>;
        /**
         * Metadata of a collection.
         */
        CollectionMetadataOf: StorageDescriptor<[Key: number], Anonymize<I35m96p3u4vl0p>, true, never>;
        /**
         * Metadata of an item.
         */
        ItemMetadataOf: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<Iapmji0h53pmkn>, true, never>;
        /**
         * Attributes of a collection.
         */
        Attribute: StorageDescriptor<Anonymize<I4ugih6gb4fmug>, Anonymize<Idrr42svup341f>, true, never>;
        /**
         * A price of an item.
         */
        ItemPriceOf: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<Ic9nev69d8grv1>, true, never>;
        /**
         * Item attribute approvals.
         */
        ItemAttributesApprovalsOf: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<Ia2lhg7l2hilo3>, false, never>;
        /**
         * Stores the `CollectionId` that is going to be used for the next collection.
         * This gets incremented whenever a new collection is created.
         */
        NextCollectionId: StorageDescriptor<[], number, true, never>;
        /**
         * Handles all the pending swaps.
         */
        PendingSwapOf: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<Idac0t49lnd4ls>, true, never>;
        /**
         * Config of a collection.
         */
        CollectionConfigOf: StorageDescriptor<[Key: number], Anonymize<I72ndo6phms8ik>, true, never>;
        /**
         * Config of an item.
         */
        ItemConfigOf: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, bigint, true, never>;
    };
    NftFractionalization: {
        /**
         * Keeps track of the corresponding NFT ID, asset ID and amount minted.
         */
        NftToAsset: StorageDescriptor<[Key: Anonymize<I9jd27rnpm8ttv>], Anonymize<I1b2ckfeib3nig>, true, never>;
    };
    TransactionStorage: {
        /**
         * Authorizations, keyed by scope.
         */
        Authorizations: StorageDescriptor<[Key: Anonymize<Icd998p53cb80u>], Anonymize<I52552vmt51a1m>, true, never>;
        /**
         * Collection of transaction metadata by block number.
         */
        Transactions: StorageDescriptor<[Key: number], Anonymize<I2rese38jhn96u>, true, never>;
        /**
         * Storage fee per byte.
         */
        ByteFee: StorageDescriptor<[], bigint, true, never>;
        /**
         * Storage fee per transaction.
         */
        EntryFee: StorageDescriptor<[], bigint, true, never>;
        /**
         * Number of blocks for which stored data must be retained.
         *
         * Data older than `RetentionPeriod` blocks is eligible for removal unless it
         * has been explicitly renewed. Validators are required to prove possession of
         * data corresponding to block `N - RetentionPeriod` when producing block `N`.
         */
        RetentionPeriod: StorageDescriptor<[], number, false, never>;
        /**
        
         */
        BlockTransactions: StorageDescriptor<[], Anonymize<I2rese38jhn96u>, false, never>;
        /**
         * Was the proof checked in this block?
         */
        ProofChecked: StorageDescriptor<[], boolean, false, never>;
    };
    VoterList: {
        /**
         * A single node, within some bag.
         *
         * Nodes store links forward and back within their respective bags.
         */
        ListNodes: StorageDescriptor<[Key: SS58String], Anonymize<Ic5t26f9cp3tvk>, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForListNodes: StorageDescriptor<[], number, false, never>;
        /**
         * A bag stored in storage.
         *
         * Stores a `Bag` struct, which stores head and tail pointers to itself.
         */
        ListBags: StorageDescriptor<[Key: bigint], Anonymize<I39k39h6vu4hbq>, true, never>;
        /**
         * Pointer that remembers the next node that will be auto-rebagged.
         * When `None`, the next scan will start from the list head again.
         */
        NextNodeAutoRebagged: StorageDescriptor<[], SS58String, true, never>;
        /**
         * Lock all updates to this pallet.
         *
         * If any nodes needs updating, removal or addition due to a temporary lock, the
         * [`Call::rebag`] can be used.
         */
        Lock: StorageDescriptor<[], null, true, never>;
        /**
         * Accounts that failed to be inserted into the bags-list due to locking.
         * These accounts will be processed with priority in `on_idle` or via `rebag` extrinsic.
         *
         * Note: This storage is intentionally unbounded. The following factors make bounding
         * unnecessary:
         * 1. The storage usage is temporary - accounts are processed and removed in `on_idle`
         * 2. The pallet is only locked during snapshot generation, which is weight-limited
         * 3. Processing happens at multiple accounts per block, clearing even large backlogs quickly
         * 4. An artificial limit could be exhausted by an attacker, preventing legitimate
         * auto-rebagging from putting accounts in the correct position
         *
         * We don't store the score here - it's always fetched from `ScoreProvider` when processing,
         * ensuring we use the most up-to-date score (accounts may have been slashed, rewarded, etc.
         * while waiting in the queue).
         */
        PendingRebag: StorageDescriptor<[Key: SS58String], null, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForPendingRebag: StorageDescriptor<[], number, false, never>;
    };
    ChildBounties: {
        /**
         * DEPRECATED: Replaced with `ParentTotalChildBounties` storage item keeping dedicated counts
         * for each parent bounty. Number of total child bounties. Will be removed in May 2025.
         */
        ChildBountyCount: StorageDescriptor<[], number, false, never>;
        /**
         * Number of active child bounties per parent bounty.
         * Map of parent bounty index to number of child bounties.
         */
        ParentChildBounties: StorageDescriptor<[Key: number], number, false, never>;
        /**
         * Number of total child bounties per parent bounty, including completed bounties.
         */
        ParentTotalChildBounties: StorageDescriptor<[Key: number], number, false, never>;
        /**
         * Child bounties that have been added.
         */
        ChildBounties: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<Ibofbvvaehln4e>, true, never>;
        /**
         * The description of each child-bounty. Indexed by `(parent_id, child_id)`.
         *
         * This item replaces the `ChildBountyDescriptions` storage item from the V0 storage version.
         */
        ChildBountyDescriptionsV1: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Uint8Array, true, never>;
        /**
         * The mapping of the child bounty ids from storage version `V0` to the new `V1` version.
         *
         * The `V0` ids based on total child bounty count [`ChildBountyCount`]`. The `V1` version ids
         * based on the child bounty count per parent bounty [`ParentTotalChildBounties`].
         * The item intended solely for client convenience and not used in the pallet's core logic.
         */
        V0ToV1ChildBountyIds: StorageDescriptor<[Key: number], Anonymize<I9jd27rnpm8ttv>, true, never>;
        /**
         * The cumulative child-bounty curator fee for each parent bounty.
         */
        ChildrenCuratorFees: StorageDescriptor<[Key: number], bigint, false, never>;
    };
    NominationPools: {
        /**
         * The sum of funds across all pools.
         *
         * This might be lower but never higher than the sum of `total_balance` of all [`PoolMembers`]
         * because calling `pool_withdraw_unbonded` might decrease the total stake of the pool's
         * `bonded_account` without adjusting the pallet-internal `UnbondingPool`'s.
         */
        TotalValueLocked: StorageDescriptor<[], bigint, false, never>;
        /**
         * Minimum amount to bond to join a pool.
         */
        MinJoinBond: StorageDescriptor<[], bigint, false, never>;
        /**
         * Minimum bond required to create a pool.
         *
         * This is the amount that the depositor must put as their initial stake in the pool, as an
         * indication of "skin in the game".
         *
         * This is the value that will always exist in the staking ledger of the pool bonded account
         * while all other accounts leave.
         */
        MinCreateBond: StorageDescriptor<[], bigint, false, never>;
        /**
         * Maximum number of nomination pools that can exist. If `None`, then an unbounded number of
         * pools can exist.
         */
        MaxPools: StorageDescriptor<[], number, true, never>;
        /**
         * Maximum number of members that can exist in the system. If `None`, then the count
         * members are not bound on a system wide basis.
         */
        MaxPoolMembers: StorageDescriptor<[], number, true, never>;
        /**
         * Maximum number of members that may belong to pool. If `None`, then the count of
         * members is not bound on a per pool basis.
         */
        MaxPoolMembersPerPool: StorageDescriptor<[], number, true, never>;
        /**
         * The maximum commission that can be charged by a pool. Used on commission payouts to bound
         * pool commissions that are > `GlobalMaxCommission`, necessary if a future
         * `GlobalMaxCommission` is lower than some current pool commissions.
         */
        GlobalMaxCommission: StorageDescriptor<[], number, true, never>;
        /**
         * Active members.
         *
         * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
         */
        PoolMembers: StorageDescriptor<[Key: SS58String], Anonymize<Idphjddn2h69vc>, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForPoolMembers: StorageDescriptor<[], number, false, never>;
        /**
         * Storage for bonded pools.
         */
        BondedPools: StorageDescriptor<[Key: number], Anonymize<Idhh9vuu2bderg>, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForBondedPools: StorageDescriptor<[], number, false, never>;
        /**
         * Reward pools. This is where there rewards for each pool accumulate. When a members payout is
         * claimed, the balance comes out of the reward pool. Keyed by the bonded pools account.
         */
        RewardPools: StorageDescriptor<[Key: number], Anonymize<If6qa32dj75gu1>, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForRewardPools: StorageDescriptor<[], number, false, never>;
        /**
         * Groups of unbonding pools. Each group of unbonding pools belongs to a
         * bonded pool, hence the name sub-pools. Keyed by the bonded pools account.
         */
        SubPoolsStorage: StorageDescriptor<[Key: number], Anonymize<I7oo2mprv1qd1s>, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForSubPoolsStorage: StorageDescriptor<[], number, false, never>;
        /**
         * Metadata for the pool.
         */
        Metadata: StorageDescriptor<[Key: number], Uint8Array, false, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForMetadata: StorageDescriptor<[], number, false, never>;
        /**
         * Ever increasing number of all pools created so far.
         */
        LastPoolId: StorageDescriptor<[], number, false, never>;
        /**
         * A reverse lookup from the pool's account id to its id.
         *
         * This is only used for slashing and on automatic withdraw update. In all other instances, the
         * pool id is used, and the accounts are deterministically derived from it.
         */
        ReversePoolIdLookup: StorageDescriptor<[Key: SS58String], number, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForReversePoolIdLookup: StorageDescriptor<[], number, false, never>;
        /**
         * Map from a pool member account to their opted claim permission.
         */
        ClaimPermissions: StorageDescriptor<[Key: SS58String], NominationPoolsClaimPermission, false, never>;
    };
    AssetConversion: {
        /**
         * Map from `PoolAssetId` to `PoolInfo`. This establishes whether a pool has been officially
         * created rather than people sending tokens directly to a pool's public account.
         */
        Pools: StorageDescriptor<[Key: Anonymize<I4lgr5i5qhk4i8>], number, true, never>;
        /**
         * Stores the `PoolAssetId` that is going to be used for the next lp token.
         * This gets incremented whenever a new lp pool is created.
         */
        NextPoolAssetId: StorageDescriptor<[], number, true, never>;
        /**
         * Per-pool swap fee overrides.
         *
         * When a pool has no entry here, the global [`Config::LPFee`] applies. This storage is purely
         * additive: existing pools and runtimes that never set a per-pool fee behave exactly as before
         * and require no migration. See [`Pallet::pool_fee`] for the resolution logic.
         */
        PoolFees: StorageDescriptor<[Key: Anonymize<I4lgr5i5qhk4i8>], number, true, never>;
    };
    FastUnstake: {
        /**
         * The current "head of the queue" being unstaked.
         *
         * The head in itself can be a batch of up to [`Config::BatchSize`] stakers.
         */
        Head: StorageDescriptor<[], Anonymize<I2eh80qovrl7h2>, true, never>;
        /**
         * The map of all accounts wishing to be unstaked.
         *
         * Keeps track of `AccountId` wishing to unstake and it's corresponding deposit.
         */
        Queue: StorageDescriptor<[Key: SS58String], bigint, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForQueue: StorageDescriptor<[], number, false, never>;
        /**
         * Number of eras to check per block.
         *
         * If set to 0, this pallet does absolutely nothing. Cannot be set to more than
         * [`Config::MaxErasToCheckPerBlock`].
         *
         * Based on the amount of weight available at [`Pallet::on_idle`], up to this many eras are
         * checked. The checking is represented by updating [`UnstakeRequest::checked`], which is
         * stored in [`Head`].
         */
        ErasToCheckPerBlock: StorageDescriptor<[], number, false, never>;
    };
    MessageQueue: {
        /**
         * The index of the first and last (non-empty) pages.
         */
        BookStateFor: StorageDescriptor<[Key: number], Anonymize<Ic1h0rm1lg7jdb>, false, never>;
        /**
         * The origin at which we should begin servicing.
         */
        ServiceHead: StorageDescriptor<[], number, true, never>;
        /**
         * The map of page indices to pages.
         */
        Pages: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<I53esa2ms463bk>, true, never>;
    };
    TxPause: {
        /**
         * The set of calls that are explicitly paused.
         */
        PausedCalls: StorageDescriptor<[Key: Anonymize<Idkbvh6dahk1v7>], null, true, never>;
    };
    SafeMode: {
        /**
         * Contains the last block number that the safe-mode will remain entered in.
         *
         * Set to `None` when safe-mode is exited.
         *
         * Safe-mode is automatically exited when the current block number exceeds this value.
         */
        EnteredUntil: StorageDescriptor<[], number, true, never>;
        /**
         * Holds the reserve that was taken from an account at a specific block number.
         *
         * This helps governance to have an overview of outstanding deposits that should be returned or
         * slashed.
         */
        Deposits: StorageDescriptor<Anonymize<I6ouflveob4eli>, bigint, true, never>;
    };
    MultiBlockMigrations: {
        /**
         * The currently active migration to run and its cursor.
         *
         * `None` indicates that no migration is running.
         */
        Cursor: StorageDescriptor<[], Anonymize<Iepbsvlk3qceij>, true, never>;
        /**
         * Set of all successfully executed migrations.
         *
         * This is used as blacklist, to not re-execute migrations that have not been removed from the
         * codebase yet. Governance can regularly clear this out via `clear_historic`.
         */
        Historic: StorageDescriptor<[Key: Uint8Array], null, true, never>;
    };
    Broker: {
        /**
         * The current configuration of this pallet.
         */
        Configuration: StorageDescriptor<[], Anonymize<Idrqj2ciheom9h>, true, never>;
        /**
         * The Polkadot Core reservations (generally tasked with the maintenance of System Chains).
         */
        Reservations: StorageDescriptor<[], Anonymize<I704rpeu2gigqg>, false, never>;
        /**
         * Force reservations that need to be inserted into the workplan at the next sale rotation.
         *
         * They are automatically freed at the next sale rotation.
         */
        ForceReservations: StorageDescriptor<[], Anonymize<I704rpeu2gigqg>, false, never>;
        /**
         * The Polkadot Core legacy leases.
         */
        Leases: StorageDescriptor<[], Anonymize<I27kh9vlj2hj16>, false, never>;
        /**
         * The current status of miscellaneous subsystems of this pallet.
         */
        Status: StorageDescriptor<[], Anonymize<I2uqrsj0afntbd>, true, never>;
        /**
         * The details of the current sale, including its properties and status.
         */
        SaleInfo: StorageDescriptor<[], Anonymize<I284aa3mhslm50>, true, never>;
        /**
         * Records of potential renewals.
         *
         * Renewals will only actually be allowed if `CompletionStatus` is actually `Complete`.
         */
        PotentialRenewals: StorageDescriptor<[Key: Anonymize<I3blejcb10m5c9>], Anonymize<I85i5336l26o5a>, true, never>;
        /**
         * The current (unassigned or provisionally assigend) Regions.
         */
        Regions: StorageDescriptor<[Key: Anonymize<I1vf976h89f2ls>], Anonymize<I4amfhnpegtv8t>, true, never>;
        /**
         * The work we plan on having each core do at a particular time in the future.
         */
        Workplan: StorageDescriptor<[Key: Anonymize<I5g2vv0ckl2m8b>], Anonymize<Ia7varbguadod5>, true, never>;
        /**
         * The current workload of each core. This gets updated with workplan as timeslices pass.
         */
        Workload: StorageDescriptor<[Key: number], Anonymize<Ia7varbguadod5>, false, never>;
        /**
         * Record of a single contribution to the Instantaneous Coretime Pool.
         */
        InstaPoolContribution: StorageDescriptor<[Key: Anonymize<I1vf976h89f2ls>], Anonymize<I81fgiotlbkabs>, true, never>;
        /**
         * Record of Coretime entering or leaving the Instantaneous Coretime Pool.
         */
        InstaPoolIo: StorageDescriptor<[Key: number], Anonymize<Ifsa7722foeg4l>, false, never>;
        /**
         * Total InstaPool rewards for each Timeslice and the number of core parts which contributed.
         */
        InstaPoolHistory: StorageDescriptor<[Key: number], Anonymize<I6a7jeqava2tob>, true, never>;
        /**
         * Received core count change from the relay chain.
         */
        CoreCountInbox: StorageDescriptor<[], number, true, never>;
        /**
         * Keeping track of cores which have auto-renewal enabled.
         *
         * Sorted by `CoreIndex` to make the removal of cores from auto-renewal more efficient.
         */
        AutoRenewals: StorageDescriptor<[], Anonymize<Iarmmkrn32a2vr>, false, never>;
        /**
         * Received revenue info from the relay chain.
         */
        RevenueInbox: StorageDescriptor<[], Anonymize<I6e7fsqs7vbr1g>, true, never>;
    };
    Mixnet: {
        /**
         * Index of the current session. This may be offset relative to the session index tracked by
         * eg `pallet_session`; mixnet session indices are independent.
         */
        CurrentSessionIndex: StorageDescriptor<[], number, false, never>;
        /**
         * Block in which the current session started.
         */
        CurrentSessionStartBlock: StorageDescriptor<[], number, false, never>;
        /**
         * Authority list for the next session.
         */
        NextAuthorityIds: StorageDescriptor<[Key: number], SizedHex<32>, true, never>;
        /**
         * Mixnode sets by session index. Only the mixnode sets for the previous, current, and next
         * sessions are kept; older sets are discarded.
         *
         * The mixnodes in each set are keyed by authority index so we can easily check if an
         * authority has registered a mixnode. The authority indices should only be used during
         * registration; the authority indices for the very first session are made up.
         */
        Mixnodes: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<I8t75ej2kqe171>, true, never>;
    };
    Parameters: {
        /**
         * Stored parameters.
         */
        Parameters: StorageDescriptor<[Key: Anonymize<I47qpjdc82anud>], Anonymize<Id73a6777qiav4>, true, never>;
    };
    Revive: {
        /**
         * A mapping from a contract's code hash to its code.
         * The code's size is bounded by [`crate::limits::BLOB_BYTES`] for PVM and
         * [`revm::primitives::eip170::MAX_CODE_SIZE`] for EVM bytecode.
         */
        PristineCode: StorageDescriptor<[Key: SizedHex<32>], Uint8Array, true, never>;
        /**
         * A mapping from a contract's code hash to its code info.
         */
        CodeInfoOf: StorageDescriptor<[Key: SizedHex<32>], Anonymize<I834nfrf667ag1>, true, never>;
        /**
         * The data associated to a contract or externally owned account.
         */
        AccountInfoOf: StorageDescriptor<[Key: SizedHex<20>], Anonymize<I14i9pui8lc778>, true, never>;
        /**
         * Native currency storage deposit contributed by a user into a contract.
         *
         * Bounds how much native value the user can receive back from that contract's
         * storage deposit.
         *
         * Keys: `(holder, contributor) -> amount`
         * - `holder`: account on which the deposit is held (a contract, or the pallet's own account
         * for code-upload deposits).
         * - `contributor`: user that funded the deposit. Receives the native portion on refund, capped
         * at this entry's `amount`.
         */
        NativeDepositOf: StorageDescriptor<Anonymize<I2na29tt2afp0j>, bigint, false, never>;
        /**
         * The immutable data associated with a given account.
         */
        ImmutableDataOf: StorageDescriptor<[Key: SizedHex<20>], Uint8Array, true, never>;
        /**
         * Terminated contracts that await lazy cleanup.
         *
         * Each entry pairs a child trie ID with the contract account so that `on_idle` can
         * drain both the child trie and any [`NativeDepositOf`] entries that named the contract
         * as `holder`. Both can be arbitrarily large, so cleanup runs lazily in `on_idle`.
         */
        DeletionQueue: StorageDescriptor<[Key: number], Anonymize<I4hkhloodl7q5t>, true, never>;
        /**
         * A pair of monotonic counters used to track the latest contract marked for deletion
         * and the latest deleted contract in queue.
         */
        DeletionQueueCounter: StorageDescriptor<[], Anonymize<I8t4pajubp34g3>, false, never>;
        /**
         * Map a Ethereum address to its original `AccountId32`.
         *
         * When deriving a `H160` from an `AccountId32` we use a hash function. In order to
         * reconstruct the original account we need to store the reverse mapping here.
         * Register your `AccountId32` using [`Pallet::map_account`] in order to
         * use it with this pallet.
         */
        OriginalAccount: StorageDescriptor<[Key: SizedHex<20>], SS58String, true, never>;
        /**
         * The current Ethereum block that is stored in the `on_finalize` method.
         *
         * # Note
         *
         * This could be further optimized into the future to store only the minimum
         * information needed to reconstruct the Ethereum block at the RPC level.
         *
         * Since the block is convenient to have around, and the extra details are capped
         * by a few hashes and the vector of transaction hashes, we store the block here.
         */
        EthereumBlock: StorageDescriptor<[], Anonymize<Idq3n4esn5nvc5>, false, never>;
        /**
         * Mapping for block number and hashes.
         *
         * The maximum number of elements stored is capped by the block hash count `BLOCK_HASH_COUNT`.
         */
        BlockHash: StorageDescriptor<[Key: number], SizedHex<32>, false, never>;
        /**
         * The details needed to reconstruct the receipt info offchain.
         *
         * This contains valuable information about the gas used by the transaction.
         *
         * NOTE: The item is unbound and should therefore never be read on chain.
         * It could otherwise inflate the PoV size of a block.
         */
        ReceiptInfoData: StorageDescriptor<[], Anonymize<I3oiqcurom3m43>, false, never>;
        /**
         * Incremental ethereum block builder.
         */
        EthBlockBuilderIR: StorageDescriptor<[], Anonymize<I20ichc5j0l1u7>, false, never>;
        /**
         * The first transaction and receipt of the ethereum block.
         *
         * These values are moved out of the `EthBlockBuilderIR` to avoid serializing and
         * deserializing them on every transaction. Instead, they are loaded when needed.
         */
        EthBlockBuilderFirstValues: StorageDescriptor<[], Anonymize<I1p16diuhde12h>, false, never>;
        /**
         * Debugging settings that can be configured when DebugEnabled config is true.
         */
        DebugSettingsOf: StorageDescriptor<[], Anonymize<I1vfb3ajo1hl6k>, false, never>;
    };
    DelegatedStaking: {
        /**
         * Map of Delegators to their `Delegation`.
         *
         * Implementation note: We are not using a double map with `delegator` and `agent` account
         * as keys since we want to restrict delegators to delegate only to one account at a time.
         */
        Delegators: StorageDescriptor<[Key: SS58String], Anonymize<I542q009qbgt8k>, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForDelegators: StorageDescriptor<[], number, false, never>;
        /**
         * Map of `Agent` to their `Ledger`.
         */
        Agents: StorageDescriptor<[Key: SS58String], Anonymize<I4e5ujckjq61g8>, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForAgents: StorageDescriptor<[], number, false, never>;
    };
    AssetsFreezer: {
        /**
         * A map that stores freezes applied on an account for a given AssetId.
         */
        Freezes: StorageDescriptor<Anonymize<I7svnfko10tq2e>, Anonymize<I762rjtdaa553f>, false, never>;
        /**
         * A map that stores the current total frozen balance for every account on a given AssetId.
         */
        FrozenBalances: StorageDescriptor<Anonymize<I7svnfko10tq2e>, bigint, true, never>;
    };
    Oracle: {
        /**
         * The raw values for each oracle operator.
         *
         * Maps `(AccountId, OracleKey)` to `TimestampedValue` containing the operator's submitted
         * value along with the timestamp when it was submitted. This storage maintains the complete
         * history of individual operator submissions, allowing for data aggregation and audit trails.
         *
         * ## Storage Economics
         *
         * No storage deposits are required as this data is considered essential for the oracle's
         * operation and data integrity. The storage cost is borne by the blockchain as part of the
         * oracle infrastructure.
         */
        RawValues: StorageDescriptor<Anonymize<I6ouflveob4eli>, Anonymize<I9055m3udr8982>, true, never>;
        /**
         * The aggregated values for each oracle key.
         *
         * Maps `OracleKey` to `TimestampedValue`.
         */
        Values: StorageDescriptor<[Key: number], Anonymize<I9055m3udr8982>, true, never>;
        /**
         * A set of accounts that have already fed data in the current block.
         *
         * This storage item tracks which oracle operators have already submitted data in the
         * current block to enforce the "one submission per block" rule. This prevents spam and
         * ensures fair participation among oracle operators.
         *
         * The storage is cleared at the end of each block in the `on_finalize` hook, resetting
         * the state for the next block.
         */
        HasDispatched: StorageDescriptor<[], Anonymize<Ia2lhg7l2hilo3>, false, never>;
    };
    MultiAssetBounties: {
        /**
         * Number of bounty proposals that have been made.
         */
        BountyCount: StorageDescriptor<[], number, false, never>;
        /**
         * Bounties that have been made.
         */
        Bounties: StorageDescriptor<[Key: number], Anonymize<Ibc0k3cev2cak7>, true, never>;
        /**
         * Child bounties that have been added.
         *
         * Indexed by `(parent_bounty_id, child_bounty_id)`.
         */
        ChildBounties: StorageDescriptor<Anonymize<I9jd27rnpm8ttv>, Anonymize<Ibitorb47on20s>, true, never>;
        /**
         * Number of active child bounties per parent bounty.
         *
         * Indexed by `parent_bounty_id`.
         */
        ChildBountiesPerParent: StorageDescriptor<[Key: number], number, false, never>;
        /**
         * Number of total child bounties per parent bounty, including completed bounties.
         *
         * Indexed by `parent_bounty_id`.
         */
        TotalChildBountiesPerParent: StorageDescriptor<[Key: number], number, false, never>;
        /**
         * The cumulative child-bounty value for each parent bounty. To be subtracted from the parent
         * bounty payout when awarding bounty.
         *
         * Indexed by `parent_bounty_id`.
         */
        ChildBountiesValuePerParent: StorageDescriptor<[Key: number], bigint, false, never>;
        /**
         * The consideration cost incurred by the child-/bounty curator for committing to the role.
         *
         * Determined by [`pallet::Config::Consideration`]. It is created when the curator accepts the
         * role, and is either burned if the curator misbehaves or consumed upon successful
         * completion of the child-/bounty.
         *
         * Note: If the parent curator is also assigned to the child-bounty,
         * the consideration cost is charged only once — when the curator
         * accepts the role for the parent bounty.
         *
         * Indexed by `(parent_bounty_id, child_bounty_id)`.
         */
        CuratorDeposit: StorageDescriptor<Anonymize<Ifmarq0v77ok>, bigint, true, never>;
    };
    AssetsPrecompiles: {
        /**
         * The next available asset index for foreign assets.
         * This is incremented each time a new foreign asset mapping is created.
         */
        NextAssetIndex: StorageDescriptor<[], number, false, never>;
        /**
         * Mapping an asset index (derived from the precompile address) to a `ForeignAssetId`.
         */
        AssetIndexToForeignAssetId: StorageDescriptor<[Key: number], number, true, never>;
        /**
         * Mapping a `ForeignAssetId` to an asset index (used for deriving precompile addresses).
         */
        ForeignAssetIdToAssetIndex: StorageDescriptor<[Key: number], number, true, never>;
    };
    AssetsPrecompilesPermit: {
        /**
         * Nonces for permit signatures.
         * Mapping: (verifying_contract, owner_address) => nonce
         *
         * Uses Blake2_128Concat for the first key to prevent storage collision attacks
         * when the verifying_contract address could be influenced by an attacker.
         *
         * Note: EIP-2612 specifies uint256 nonce. We store as U256 for compatibility.
         */
        Nonces: StorageDescriptor<Anonymize<I76g8pnvlrcvkk>, Anonymize<I4totqt881mlti>, false, never>;
    };
    RegistrarPara: {
        /**
         * The next para id that [`Pallet::reserve`] will hand out.
         */
        NextFreeParaId: StorageDescriptor<[], number, false, never>;
        /**
         * The id the next message to the relay chain will carry.
         *
         * One per message sent, echoed back in the relay chain's response, so a request, its
         * response and the events on both chains can be tied together.
         */
        NextMessageId: StorageDescriptor<[], bigint, false, never>;
        /**
         * Every para id reserved through this pallet, and what is happening with it.
         */
        Paras: StorageDescriptor<[Key: number], Anonymize<Ic994l4okqiqmh>, true, never>;
    };
    RegistrarRelay: {
        /**
         * Registrations waiting on their validation code, by para id.
         *
         * Counted so [`Config::MaxPendingRegistrations`] can be enforced with a single read.
         */
        PendingRegistrations: StorageDescriptor<[Key: number], Anonymize<I54ga0rrt8nrua>, true, never>;
        /**
         * Counter for the related counted storage map
         */
        CounterForPendingRegistrations: StorageDescriptor<[], number, false, never>;
    };
};
type ICalls = {
    System: {
        /**
         * Make some on-chain remark.
         *
         * Can be executed by every `origin`.
         */
        remark: TxDescriptor<Anonymize<I8ofcg5rbj0g2c>>;
        /**
         * Set the number of pages in the WebAssembly environment's heap.
         */
        set_heap_pages: TxDescriptor<Anonymize<I4adgbll7gku4i>>;
        /**
         * Set the new runtime code.
         */
        set_code: TxDescriptor<Anonymize<I6pjjpfvhvcfru>>;
        /**
         * Set the new runtime code without doing any checks of the given `code`.
         *
         * Note that runtime upgrades will not run if this is called with a not-increasing spec
         * version!
         */
        set_code_without_checks: TxDescriptor<Anonymize<I6pjjpfvhvcfru>>;
        /**
         * Set some items of storage.
         */
        set_storage: TxDescriptor<Anonymize<I9pj91mj79qekl>>;
        /**
         * Kill some items from storage.
         */
        kill_storage: TxDescriptor<Anonymize<I39uah9nss64h9>>;
        /**
         * Kill all storage items with a key that starts with the given prefix.
         *
         * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
         * the prefix we are removing to accurately calculate the weight of this function.
         */
        kill_prefix: TxDescriptor<Anonymize<Ik64dknsq7k08>>;
        /**
         * Make some on-chain remark and emit event.
         */
        remark_with_event: TxDescriptor<Anonymize<I8ofcg5rbj0g2c>>;
        /**
         * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
         * later.
         *
         * This call requires Root origin.
         */
        authorize_upgrade: TxDescriptor<Anonymize<Ib51vk42m1po4n>>;
        /**
         * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
         * later.
         *
         * WARNING: This authorizes an upgrade that will take place without any safety checks, for
         * example that the spec name remains the same and that the version number increases. Not
         * recommended for normal use. Use `authorize_upgrade` instead.
         *
         * This call requires Root origin.
         */
        authorize_upgrade_without_checks: TxDescriptor<Anonymize<Ib51vk42m1po4n>>;
        /**
         * Provide the preimage (runtime binary) `code` for an upgrade that has been authorized.
         *
         * If the authorization required a version check, this call will ensure the spec name
         * remains unchanged and that the spec version has increased.
         *
         * Depending on the runtime's `OnSetCode` configuration, this function may directly apply
         * the new `code` in the same block or attempt to schedule the upgrade.
         *
         * All origins are allowed.
         */
        apply_authorized_upgrade: TxDescriptor<Anonymize<I6pjjpfvhvcfru>>;
    };
    Utility: {
        /**
         * Send a batch of dispatch calls.
         *
         * May be called from any origin except `None`.
         *
         * - `calls`: The calls to be dispatched from the same origin. The number of call must not
         * exceed the constant: `batched_calls_limit` (available in constant metadata).
         *
         * If origin is root then the calls are dispatched without checking origin filter. (This
         * includes bypassing `frame_system::Config::BaseCallFilter`).
         *
         * ## Complexity
         * - O(C) where C is the number of calls to be batched.
         *
         * This will return `Ok` in all circumstances. To determine the success of the batch, an
         * event is deposited. If a call failed and the batch was interrupted, then the
         * `BatchInterrupted` event is deposited, along with the number of successful calls made
         * and the error of the failed call. If all were successful, then the `BatchCompleted`
         * event is deposited.
         */
        batch: TxDescriptor<Anonymize<I9qo50msie06h7>>;
        /**
         * Send a call through an indexed pseudonym of the sender.
         *
         * Filter from origin are passed along. The call will be dispatched with an origin which
         * use the same filter as the origin of this call.
         *
         * NOTE: If you need to ensure that any account-based filtering is not honored (i.e.
         * because you expect `proxy` to have been used prior in the call stack and you do not want
         * the call restrictions to apply to any sub-accounts), then use `as_multi_threshold_1`
         * in the Multisig pallet instead.
         *
         * NOTE: Prior to version *12, this was called `as_limited_sub`.
         *
         * The dispatch origin for this call must be _Signed_.
         */
        as_derivative: TxDescriptor<Anonymize<I9ce1pv1nr9ipb>>;
        /**
         * Send a batch of dispatch calls and atomically execute them.
         * The whole transaction will rollback and fail if any of the calls failed.
         *
         * May be called from any origin except `None`.
         *
         * - `calls`: The calls to be dispatched from the same origin. The number of call must not
         * exceed the constant: `batched_calls_limit` (available in constant metadata).
         *
         * If origin is root then the calls are dispatched without checking origin filter. (This
         * includes bypassing `frame_system::Config::BaseCallFilter`).
         *
         * ## Complexity
         * - O(C) where C is the number of calls to be batched.
         */
        batch_all: TxDescriptor<Anonymize<I9qo50msie06h7>>;
        /**
         * Dispatches a function call with a provided origin.
         *
         * The dispatch origin for this call must be _Root_.
         *
         * ## Complexity
         * - O(1).
         */
        dispatch_as: TxDescriptor<Anonymize<Ib328pv185cqh5>>;
        /**
         * Send a batch of dispatch calls.
         * Unlike `batch`, it allows errors and won't interrupt.
         *
         * May be called from any origin except `None`.
         *
         * - `calls`: The calls to be dispatched from the same origin. The number of call must not
         * exceed the constant: `batched_calls_limit` (available in constant metadata).
         *
         * If origin is root then the calls are dispatch without checking origin filter. (This
         * includes bypassing `frame_system::Config::BaseCallFilter`).
         *
         * ## Complexity
         * - O(C) where C is the number of calls to be batched.
         */
        force_batch: TxDescriptor<Anonymize<I9qo50msie06h7>>;
        /**
         * Dispatch a function call with a specified weight.
         *
         * This function does not check the weight of the call, and instead allows the
         * Root origin to specify the weight of the call.
         *
         * The dispatch origin for this call must be _Root_.
         */
        with_weight: TxDescriptor<Anonymize<I8ucjbjltduo5i>>;
        /**
         * Dispatch a fallback call in the event the main call fails to execute.
         * May be called from any origin except `None`.
         *
         * This function first attempts to dispatch the `main` call.
         * If the `main` call fails, the `fallback` is attemted.
         * if the fallback is successfully dispatched, the weights of both calls
         * are accumulated and an event containing the main call error is deposited.
         *
         * In the event of a fallback failure the whole call fails
         * with the weights returned.
         *
         * - `main`: The main call to be dispatched. This is the primary action to execute.
         * - `fallback`: The fallback call to be dispatched in case the `main` call fails.
         *
         * ## Dispatch Logic
         * - If the origin is `root`, both the main and fallback calls are executed without
         * applying any origin filters.
         * - If the origin is not `root`, the origin filter is applied to both the `main` and
         * `fallback` calls.
         *
         * ## Use Case
         * - Some use cases might involve submitting a `batch` type call in either main, fallback
         * or both.
         */
        if_else: TxDescriptor<Anonymize<Ib1loc02pbmlsk>>;
        /**
         * Dispatches a function call with a provided origin.
         *
         * Almost the same as [`Pallet::dispatch_as`] but forwards any error of the inner call.
         *
         * The dispatch origin for this call must be _Root_.
         */
        dispatch_as_fallible: TxDescriptor<Anonymize<Ib328pv185cqh5>>;
    };
    Babe: {
        /**
         * Report authority equivocation/misbehavior. This method will verify
         * the equivocation proof and validate the given key ownership proof
         * against the extracted offender. If both are valid, the offence will
         * be reported.
         */
        report_equivocation: TxDescriptor<Anonymize<I50ppnqasq4tjq>>;
        /**
         * Report authority equivocation/misbehavior. This method will verify
         * the equivocation proof and validate the given key ownership proof
         * against the extracted offender. If both are valid, the offence will
         * be reported.
         * This extrinsic must be called unsigned and it is expected that only
         * block authors will call it (validated in `ValidateUnsigned`), as such
         * if the block author is defined it will be defined as the equivocation
         * reporter.
         */
        report_equivocation_unsigned: TxDescriptor<Anonymize<I50ppnqasq4tjq>>;
        /**
         * Plan an epoch config change. The epoch config change is recorded and will be enacted on
         * the next call to `enact_epoch_change`. The config will be activated one epoch after.
         * Multiple calls to this method will replace any existing planned config change that had
         * not been enacted yet.
         */
        plan_config_change: TxDescriptor<Anonymize<I9fin09kkg0jaj>>;
    };
    Timestamp: {
        /**
         * Set the current time.
         *
         * This call should be invoked exactly once per block. It will panic at the finalization
         * phase, if this call hasn't been invoked by that time.
         *
         * The timestamp should be greater than the previous one by the amount specified by
         * [`Config::MinimumPeriod`].
         *
         * The dispatch origin for this call must be _None_.
         *
         * This dispatch class is _Mandatory_ to ensure it gets executed in the block. Be aware
         * that changing the complexity of this call could result exhausting the resources in a
         * block to execute any other calls.
         *
         * ## Complexity
         * - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`)
         * - 1 storage read and 1 storage mutation (codec `O(1)` because of `DidUpdate::take` in
         * `on_finalize`)
         * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
         */
        set: TxDescriptor<Anonymize<Idcr6u6361oad9>>;
    };
    Indices: {
        /**
         * Assign an previously unassigned index.
         *
         * Payment: `Deposit` is reserved from the sender account.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * - `index`: the index to be claimed. This must not be in use.
         *
         * Emits `IndexAssigned` if successful.
         *
         * ## Complexity
         * - `O(1)`.
         */
        claim: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * Assign an index already owned by the sender to another account. The balance reservation
         * is effectively transferred to the new account.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * - `index`: the index to be re-assigned. This must be owned by the sender.
         * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
         *
         * Emits `IndexAssigned` if successful.
         *
         * ## Complexity
         * - `O(1)`.
         */
        transfer: TxDescriptor<Anonymize<I1u3ac7lafvv5b>>;
        /**
         * Free up an index owned by the sender.
         *
         * Payment: Any previous deposit placed for the index is unreserved in the sender account.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must own the index.
         *
         * - `index`: the index to be freed. This must be owned by the sender.
         *
         * Emits `IndexFreed` if successful.
         *
         * ## Complexity
         * - `O(1)`.
         */
        free: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * Force an index to an account. This doesn't require a deposit. If the index is already
         * held, then any deposit is reimbursed to its current owner.
         *
         * The dispatch origin for this call must be _Root_.
         *
         * - `index`: the index to be (re-)assigned.
         * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
         * - `freeze`: if set to `true`, will freeze the index so it cannot be transferred.
         *
         * Emits `IndexAssigned` if successful.
         *
         * ## Complexity
         * - `O(1)`.
         */
        force_transfer: TxDescriptor<Anonymize<I5teebeg0opib2>>;
        /**
         * Freeze an index so it will always point to the sender account. This consumes the
         * deposit.
         *
         * The dispatch origin for this call must be _Signed_ and the signing account must have a
         * non-frozen account `index`.
         *
         * - `index`: the index to be frozen in place.
         *
         * Emits `IndexFrozen` if successful.
         *
         * ## Complexity
         * - `O(1)`.
         */
        freeze: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * Poke the deposit reserved for an index.
         *
         * The dispatch origin for this call must be _Signed_ and the signing account must have a
         * non-frozen account `index`.
         *
         * The transaction fees is waived if the deposit is changed after poking/reconsideration.
         *
         * - `index`: the index whose deposit is to be poked/reconsidered.
         *
         * Emits `DepositPoked` if successful.
         */
        poke_deposit: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    };
    Balances: {
        /**
         * Transfer some liquid free balance to another account.
         *
         * `transfer_allow_death` will set the `FreeBalance` of the sender and receiver.
         * If the sender's account is below the existential deposit as a result
         * of the transfer, the account will be reaped.
         *
         * The dispatch origin for this call must be `Signed` by the transactor.
         */
        transfer_allow_death: TxDescriptor<Anonymize<I65i612een2ak>>;
        /**
         * Exactly as `transfer_allow_death`, except the origin must be root and the source account
         * may be specified.
         */
        force_transfer: TxDescriptor<Anonymize<I5vvf47ira6s09>>;
        /**
         * Same as the [`transfer_allow_death`] call, but with a check that the transfer will not
         * kill the origin account.
         *
         * 99% of the time you want [`transfer_allow_death`] instead.
         *
         * [`transfer_allow_death`]: struct.Pallet.html#method.transfer
         */
        transfer_keep_alive: TxDescriptor<Anonymize<I65i612een2ak>>;
        /**
         * Transfer the entire transferable balance from the caller account.
         *
         * NOTE: This function only attempts to transfer _transferable_ balances. This means that
         * any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be
         * transferred by this function. To ensure that this function results in a killed account,
         * you might need to prepare the account by removing any reference counters, storage
         * deposits, etc...
         *
         * The dispatch origin of this call must be Signed.
         *
         * - `dest`: The recipient of the transfer.
         * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
         * of the funds the account has, causing the sender account to be killed (false), or
         * transfer everything except at least the existential deposit, which will guarantee to
         * keep the sender account alive (true).
         */
        transfer_all: TxDescriptor<Anonymize<I5ns79ftlq8cnl>>;
        /**
         * Unreserve some balance from a user by force.
         *
         * Can only be called by ROOT.
         */
        force_unreserve: TxDescriptor<Anonymize<I59ofijoau4bjh>>;
        /**
         * Upgrade a specified account.
         *
         * - `origin`: Must be `Signed`.
         * - `who`: The account to be upgraded.
         *
         * This will waive the transaction fee if at least all but 10% of the accounts needed to
         * be upgraded. (We let some not have to be upgraded just in order to allow for the
         * possibility of churn).
         */
        upgrade_accounts: TxDescriptor<Anonymize<Ibmr18suc9ikh9>>;
        /**
         * Set the regular balance of a given account.
         *
         * The dispatch origin for this call is `root`.
         */
        force_set_balance: TxDescriptor<Anonymize<Ieka2e164ntfss>>;
        /**
         * Adjust the total issuance in a saturating way.
         *
         * Can only be called by root and always needs a positive `delta`.
         *
         * # Example
         */
        force_adjust_total_issuance: TxDescriptor<Anonymize<I5u8olqbbvfnvf>>;
        /**
         * Burn the specified liquid free balance from the origin account.
         *
         * If the origin's account ends up below the existential deposit as a result
         * of the burn and `keep_alive` is false, the account will be reaped.
         *
         * Unlike sending funds to a _burn_ address, which merely makes the funds inaccessible,
         * this `burn` operation will reduce total issuance by the amount _burned_.
         */
        burn: TxDescriptor<Anonymize<I5utcetro501ir>>;
    };
    ElectionProviderMultiPhase: {
        /**
         * Submit a solution for the unsigned phase.
         *
         * The dispatch origin fo this call must be __none__.
         *
         * This submission is checked on the fly. Moreover, this unsigned solution is only
         * validated when submitted to the pool from the **local** node. Effectively, this means
         * that only active validators can submit this transaction when authoring a block (similar
         * to an inherent).
         *
         * To prevent any incorrect solution (and thus wasted time/weight), this transaction will
         * panic if the solution submitted by the validator is invalid in any way, effectively
         * putting their authoring reward at risk.
         *
         * No deposit or reward is associated with this submission.
         */
        submit_unsigned: TxDescriptor<Anonymize<I31k9f0jol8ko4>>;
        /**
         * Set a new value for `MinimumUntrustedScore`.
         *
         * Dispatch origin must be aligned with `T::ForceOrigin`.
         *
         * This check can be turned off by setting the value to `None`.
         */
        set_minimum_untrusted_score: TxDescriptor<Anonymize<I80q14um2s2ckg>>;
        /**
         * Set a solution in the queue, to be handed out to the client of this pallet in the next
         * call to `ElectionProvider::elect`.
         *
         * This can only be set by `T::ForceOrigin`, and only when the phase is `Emergency`.
         *
         * The solution is not checked for any feasibility and is assumed to be trustworthy, as any
         * feasibility check itself can in principle cause the election process to fail (due to
         * memory/weight constrains).
         */
        set_emergency_election_result: TxDescriptor<Anonymize<I5qs1t1erfi7u8>>;
        /**
         * Submit a solution for the signed phase.
         *
         * The dispatch origin fo this call must be __signed__.
         *
         * The solution is potentially queued, based on the claimed score and processed at the end
         * of the signed phase.
         *
         * A deposit is reserved and recorded for the solution. Based on the outcome, the solution
         * might be rewarded, slashed, or get all or a part of the deposit back.
         */
        submit: TxDescriptor<Anonymize<I9et13knvdvgpb>>;
        /**
         * Trigger the governance fallback.
         *
         * This can only be called when [`Phase::Emergency`] is enabled, as an alternative to
         * calling [`Call::set_emergency_election_result`].
         */
        governance_fallback: TxDescriptor<undefined>;
    };
    Staking: {
        /**
         * Take the origin account as a stash and lock up `value` of its balance. `controller` will
         * be the account that controls it.
         *
         * `value` must be more than the `minimum_balance` specified by `T::Currency`.
         *
         * The dispatch origin for this call must be _Signed_ by the stash account.
         *
         * Emits `Bonded`.
         * ## Complexity
         * - Independent of the arguments. Moderate complexity.
         * - O(1).
         * - Three extra DB entries.
         *
         * NOTE: Two of the storage writes (`Self::bonded`, `Self::payee`) are _never_ cleaned
         * unless the `origin` falls below _existential deposit_ (or equal to 0) and gets removed
         * as dust.
         */
        bond: TxDescriptor<Anonymize<I2eip8tc75dpje>>;
        /**
         * Add some extra amount that have appeared in the stash `free_balance` into the balance up
         * for staking.
         *
         * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
         *
         * Use this if there are additional funds in your stash account that you wish to bond.
         * Unlike [`bond`](Self::bond) or [`unbond`](Self::unbond) this function does not impose
         * any limitation on the amount that can be added.
         *
         * Emits `Bonded`.
         *
         * ## Complexity
         * - Independent of the arguments. Insignificant complexity.
         * - O(1).
         */
        bond_extra: TxDescriptor<Anonymize<I564va64vtidbq>>;
        /**
         * Schedule a portion of the stash to be unlocked ready for transfer out after the bond
         * period ends. If this leaves an amount actively bonded less than
         * [`asset::existential_deposit`], then it is increased to the full amount.
         *
         * The stash may be chilled if the ledger total amount falls to 0 after unbonding.
         *
         * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
         *
         * Once the unlock period is done, you can call `withdraw_unbonded` to actually move
         * the funds out of management ready for transfer.
         *
         * No more than a limited number of unlocking chunks (see `MaxUnlockingChunks`)
         * can co-exists at the same time. If there are no unlocking chunks slots available
         * [`Call::withdraw_unbonded`] is called to remove some of the chunks (if possible).
         *
         * If a user encounters the `InsufficientBond` error when calling this extrinsic,
         * they should call `chill` first in order to free up their bonded funds.
         *
         * Emits `Unbonded`.
         *
         * See also [`Call::withdraw_unbonded`].
         */
        unbond: TxDescriptor<Anonymize<Ie5v6njpckr05b>>;
        /**
         * Remove any unlocked chunks from the `unlocking` queue from our management.
         *
         * This essentially frees up that balance to be used by the stash account to do whatever
         * it wants.
         *
         * The dispatch origin for this call must be _Signed_ by the controller.
         *
         * Emits `Withdrawn`.
         *
         * See also [`Call::unbond`].
         *
         * ## Parameters
         *
         * - `num_slashing_spans` indicates the number of metadata slashing spans to clear when
         * this call results in a complete removal of all the data related to the stash account.
         * In this case, the `num_slashing_spans` must be larger or equal to the number of
         * slashing spans associated with the stash account in the [`SlashingSpans`] storage type,
         * otherwise the call will fail. The call weight is directly proportional to
         * `num_slashing_spans`.
         *
         * ## Complexity
         * O(S) where S is the number of slashing spans to remove
         * NOTE: Weight annotation is the kill scenario, we refund otherwise.
         */
        withdraw_unbonded: TxDescriptor<Anonymize<I328av3j0bgmjb>>;
        /**
         * Declare the desire to validate for the origin controller.
         *
         * Effects will be felt at the beginning of the next era.
         *
         * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
         */
        validate: TxDescriptor<Anonymize<I4tuqm9ato907i>>;
        /**
         * Declare the desire to nominate `targets` for the origin controller.
         *
         * Effects will be felt at the beginning of the next era.
         *
         * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
         *
         * ## Complexity
         * - The transaction's complexity is proportional to the size of `targets` (N)
         * which is capped at CompactAssignments::LIMIT (T::MaxNominations).
         * - Both the reads and writes follow a similar pattern.
         */
        nominate: TxDescriptor<Anonymize<I19iomcbdrerea>>;
        /**
         * Declare no desire to either validate or nominate.
         *
         * Effects will be felt at the beginning of the next era.
         *
         * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
         *
         * ## Complexity
         * - Independent of the arguments. Insignificant complexity.
         * - Contains one read.
         * - Writes are limited to the `origin` account key.
         */
        chill: TxDescriptor<undefined>;
        /**
         * (Re-)set the payment target for a controller.
         *
         * Effects will be felt instantly (as soon as this function is completed successfully).
         *
         * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
         *
         * ## Complexity
         * - O(1)
         * - Independent of the arguments. Insignificant complexity.
         * - Contains a limited number of reads.
         * - Writes are limited to the `origin` account key.
         * ---------
         */
        set_payee: TxDescriptor<Anonymize<I9dgmcnuamt5p8>>;
        /**
         * (Re-)sets the controller of a stash to the stash itself. This function previously
         * accepted a `controller` argument to set the controller to an account other than the
         * stash itself. This functionality has now been removed, now only setting the controller
         * to the stash, if it is not already.
         *
         * Effects will be felt instantly (as soon as this function is completed successfully).
         *
         * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
         *
         * ## Complexity
         * O(1)
         * - Independent of the arguments. Insignificant complexity.
         * - Contains a limited number of reads.
         * - Writes are limited to the `origin` account key.
         */
        set_controller: TxDescriptor<undefined>;
        /**
         * Sets the ideal number of validators.
         *
         * The dispatch origin must be Root.
         *
         * ## Complexity
         * O(1)
         */
        set_validator_count: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
        /**
         * Increments the ideal number of validators up to maximum of
         * `ElectionProviderBase::MaxWinners`.
         *
         * The dispatch origin must be Root.
         *
         * ## Complexity
         * Same as [`Self::set_validator_count`].
         */
        increase_validator_count: TxDescriptor<Anonymize<Ifhs60omlhvt3>>;
        /**
         * Scale up the ideal number of validators by a factor up to maximum of
         * `ElectionProviderBase::MaxWinners`.
         *
         * The dispatch origin must be Root.
         *
         * ## Complexity
         * Same as [`Self::set_validator_count`].
         */
        scale_validator_count: TxDescriptor<Anonymize<If34udpd5e57vi>>;
        /**
         * Force there to be no new eras indefinitely.
         *
         * The dispatch origin must be Root.
         *
         * # Warning
         *
         * The election process starts multiple blocks before the end of the era.
         * Thus the election process may be ongoing when this is called. In this case the
         * election will continue until the next era is triggered.
         *
         * ## Complexity
         * - No arguments.
         * - Weight: O(1)
         */
        force_no_eras: TxDescriptor<undefined>;
        /**
         * Force there to be a new era at the end of the next session. After this, it will be
         * reset to normal (non-forced) behaviour.
         *
         * The dispatch origin must be Root.
         *
         * # Warning
         *
         * The election process starts multiple blocks before the end of the era.
         * If this is called just before a new era is triggered, the election process may not
         * have enough blocks to get a result.
         *
         * ## Complexity
         * - No arguments.
         * - Weight: O(1)
         */
        force_new_era: TxDescriptor<undefined>;
        /**
         * Set the validators who cannot be slashed (if any).
         *
         * The dispatch origin must be Root.
         */
        set_invulnerables: TxDescriptor<Anonymize<I39t01nnod9109>>;
        /**
         * Force a current staker to become completely unstaked, immediately.
         *
         * The dispatch origin must be Root.
         *
         * ## Parameters
         *
         * - `num_slashing_spans`: Refer to comments on [`Call::withdraw_unbonded`] for more
         * details.
         */
        force_unstake: TxDescriptor<Anonymize<Ie5vbnd9198quk>>;
        /**
         * Force there to be a new era at the end of sessions indefinitely.
         *
         * The dispatch origin must be Root.
         *
         * # Warning
         *
         * The election process starts multiple blocks before the end of the era.
         * If this is called just before a new era is triggered, the election process may not
         * have enough blocks to get a result.
         */
        force_new_era_always: TxDescriptor<undefined>;
        /**
         * Cancel enactment of a deferred slash.
         *
         * Can be called by the `T::AdminOrigin`.
         *
         * Parameters: era and indices of the slashes for that era to kill.
         * They **must** be sorted in ascending order, *and* unique.
         */
        cancel_deferred_slash: TxDescriptor<Anonymize<I3h6murn8bd4v5>>;
        /**
         * Pay out next page of the stakers behind a validator for the given era.
         *
         * - `validator_stash` is the stash account of the validator.
         * - `era` may be any era between `[current_era - history_depth; current_era]`.
         *
         * The origin of this call must be _Signed_. Any account can call this function, even if
         * it is not one of the stakers.
         *
         * The reward payout could be paged in case there are too many nominators backing the
         * `validator_stash`. This call will payout unpaid pages in an ascending order. To claim a
         * specific page, use `payout_stakers_by_page`.`
         *
         * If all pages are claimed, it returns an error `InvalidPage`.
         */
        payout_stakers: TxDescriptor<Anonymize<I6k6jf8ncesuu3>>;
        /**
         * Rebond a portion of the stash scheduled to be unlocked.
         *
         * The dispatch origin must be signed by the controller.
         *
         * ## Complexity
         * - Time complexity: O(L), where L is unlocking chunks
         * - Bounded by `MaxUnlockingChunks`.
         */
        rebond: TxDescriptor<Anonymize<Ie5v6njpckr05b>>;
        /**
         * Remove all data structures concerning a staker/stash once it is at a state where it can
         * be considered `dust` in the staking system. The requirements are:
         *
         * 1. the `total_balance` of the stash is below existential deposit.
         * 2. or, the `ledger.total` of the stash is below existential deposit.
         * 3. or, existential deposit is zero and either `total_balance` or `ledger.total` is zero.
         *
         * The former can happen in cases like a slash; the latter when a fully unbonded account
         * is still receiving staking rewards in `RewardDestination::Staked`.
         *
         * It can be called by anyone, as long as `stash` meets the above requirements.
         *
         * Refunds the transaction fees upon successful execution.
         *
         * ## Parameters
         *
         * - `num_slashing_spans`: Refer to comments on [`Call::withdraw_unbonded`] for more
         * details.
         */
        reap_stash: TxDescriptor<Anonymize<Ie5vbnd9198quk>>;
        /**
         * Remove the given nominations from the calling validator.
         *
         * Effects will be felt at the beginning of the next era.
         *
         * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
         *
         * - `who`: A list of nominator stash accounts who are nominating this validator which
         * should no longer be nominating this validator.
         *
         * Note: Making this call only makes sense if you first set the validator preferences to
         * block any further nominations.
         */
        kick: TxDescriptor<Anonymize<I6rqcpg80db1fb>>;
        /**
         * Update the various staking configurations .
         *
         * * `min_nominator_bond`: The minimum active bond needed to be a nominator.
         * * `min_validator_bond`: The minimum active bond needed to be a validator.
         * * `max_nominator_count`: The max number of users who can be a nominator at once. When
         * set to `None`, no limit is enforced.
         * * `max_validator_count`: The max number of users who can be a validator at once. When
         * set to `None`, no limit is enforced.
         * * `chill_threshold`: The ratio of `max_nominator_count` or `max_validator_count` which
         * should be filled in order for the `chill_other` transaction to work.
         * * `min_commission`: The minimum amount of commission that each validators must maintain.
         * This is checked only upon calling `validate`. Existing validators are not affected.
         *
         * RuntimeOrigin must be Root to call this function.
         *
         * NOTE: Existing nominators and validators will not be affected by this update.
         * to kick people under the new limits, `chill_other` should be called.
         */
        set_staking_configs: TxDescriptor<Anonymize<If1qr0kbbl298c>>;
        /**
         * Declare a `controller` to stop participating as either a validator or nominator.
         *
         * Effects will be felt at the beginning of the next era.
         *
         * The dispatch origin for this call must be _Signed_, but can be called by anyone.
         *
         * If the caller is the same as the controller being targeted, then no further checks are
         * enforced, and this function behaves just like `chill`.
         *
         * If the caller is different than the controller being targeted, the following conditions
         * must be met:
         *
         * * `controller` must belong to a nominator who has become non-decodable,
         *
         * Or:
         *
         * * A `ChillThreshold` must be set and checked which defines how close to the max
         * nominators or validators we must reach before users can start chilling one-another.
         * * A `MaxNominatorCount` and `MaxValidatorCount` must be set which is used to determine
         * how close we are to the threshold.
         * * A `MinNominatorBond` and `MinValidatorBond` must be set and checked, which determines
         * if this is a person that should be chilled because they have not met the threshold
         * bond required.
         *
         * This can be helpful if bond requirements are updated, and we need to remove old users
         * who do not satisfy these requirements.
         */
        chill_other: TxDescriptor<Anonymize<Idl3umm12u5pa>>;
        /**
         * Force a validator to have at least the minimum commission. This will not affect a
         * validator who already has a commission greater than or equal to the minimum. Any account
         * can call this.
         */
        force_apply_min_commission: TxDescriptor<Anonymize<I5ont0141q9ss5>>;
        /**
         * Sets the minimum amount of commission that each validators must maintain.
         *
         * This call has lower privilege requirements than `set_staking_config` and can be called
         * by the `T::AdminOrigin`. Root can always call this.
         */
        set_min_commission: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
        /**
         * Pay out a page of the stakers behind a validator for the given era and page.
         *
         * - `validator_stash` is the stash account of the validator.
         * - `era` may be any era between `[current_era - history_depth; current_era]`.
         * - `page` is the page index of nominators to pay out with value between 0 and
         * `num_nominators / T::MaxExposurePageSize`.
         *
         * The origin of this call must be _Signed_. Any account can call this function, even if
         * it is not one of the stakers.
         *
         * If a validator has more than [`Config::MaxExposurePageSize`] nominators backing
         * them, then the list of nominators is paged, with each page being capped at
         * [`Config::MaxExposurePageSize`]. If a validator has more than one page of nominators,
         * the call needs to be made for each page separately in order for all the nominators
         * backing a validator to receive the reward. The nominators are not sorted across pages
         * and so it should not be assumed the highest staker would be on the topmost page and vice
         * versa. If rewards are not claimed in [`Config::HistoryDepth`] eras, they are lost.
         */
        payout_stakers_by_page: TxDescriptor<Anonymize<Ie6j49utvii126>>;
        /**
         * Migrates an account's `RewardDestination::Controller` to
         * `RewardDestination::Account(controller)`.
         *
         * Effects will be felt instantly (as soon as this function is completed successfully).
         *
         * This will waive the transaction fee if the `payee` is successfully migrated.
         */
        update_payee: TxDescriptor<Anonymize<I3v6ks33uluhnj>>;
        /**
         * Updates a batch of controller accounts to their corresponding stash account if they are
         * not the same. Ignores any controller accounts that do not exist, and does not operate if
         * the stash and controller are already the same.
         *
         * Effects will be felt instantly (as soon as this function is completed successfully).
         *
         * The dispatch origin must be `T::AdminOrigin`.
         */
        deprecate_controller_batch: TxDescriptor<Anonymize<I3kiiim1cds68i>>;
        /**
         * Restores the state of a ledger which is in an inconsistent state.
         *
         * The requirements to restore a ledger are the following:
         * * The stash is bonded; or
         * * The stash is not bonded but it has a staking lock left behind; or
         * * If the stash has an associated ledger and its state is inconsistent; or
         * * If the ledger is not corrupted *but* its staking lock is out of sync.
         *
         * The `maybe_*` input parameters will overwrite the corresponding data and metadata of the
         * ledger associated with the stash. If the input parameters are not set, the ledger will
         * be reset values from on-chain state.
         */
        restore_ledger: TxDescriptor<Anonymize<I4k60mkh2r6jjg>>;
        /**
         * Removes the legacy Staking locks if they exist.
         *
         * This removes the legacy lock on the stake with [`Config::OldCurrency`] and creates a
         * hold on it if needed. If all stake cannot be held, the best effort is made to hold as
         * much as possible. The remaining stake is forced withdrawn from the ledger.
         *
         * The fee is waived if the migration is successful.
         */
        migrate_currency: TxDescriptor<Anonymize<Idl3umm12u5pa>>;
        /**
         * This function allows governance to manually slash a validator and is a
         * **fallback mechanism**.
         *
         * The dispatch origin must be `T::AdminOrigin`.
         *
         * ## Parameters
         * - `validator_stash` - The stash account of the validator to slash.
         * - `era` - The era in which the validator was in the active set.
         * - `slash_fraction` - The percentage of the stake to slash, expressed as a Perbill.
         *
         * ## Behavior
         *
         * The slash will be applied using the standard slashing mechanics, respecting the
         * configured `SlashDeferDuration`.
         *
         * This means:
         * - If the validator was already slashed by a higher percentage for the same era, this
         * slash will have no additional effect.
         * - If the validator was previously slashed by a lower percentage, only the difference
         * will be applied.
         * - The slash will be deferred by `SlashDeferDuration` eras before being enacted.
         */
        manual_slash: TxDescriptor<Anonymize<Ic5njrpnvi3f8g>>;
    };
    Session: {
        /**
         * Sets the session key(s) of the function caller to `keys`.
         *
         * Allows an account to set its session key prior to becoming a validator.
         * This doesn't take effect until the next session.
         *
         * - `origin`: The dispatch origin of this function must be signed.
         * - `keys`: The new session keys to set. These are the public keys of all sessions keys
         * setup in the runtime.
         * - `proof`: The proof that `origin` has access to the private keys of `keys`. See
         * [`impl_opaque_keys`](sp_runtime::impl_opaque_keys) for more information about the
         * proof format.
         */
        set_keys: TxDescriptor<Anonymize<I8gh566he1q1pj>>;
        /**
         * Removes any session key(s) of the function caller.
         *
         * This doesn't take effect until the next session.
         *
         * The dispatch origin of this function must be Signed and the account must be either be
         * convertible to a validator ID using the chain's typical addressing system (this usually
         * means being a controller account) or directly convertible into a validator ID (which
         * usually means being a stash account).
         */
        purge_keys: TxDescriptor<undefined>;
    };
    TechnicalCommittee: {
        /**
         * Set the collective's membership.
         *
         * - `new_members`: The new member list. Be nice to the chain and provide it sorted.
         * - `prime`: The prime member whose vote sets the default.
         * - `old_count`: The upper bound for the previous number of members in storage. Used for
         * weight estimation.
         *
         * The dispatch of this call must be `SetMembersOrigin`.
         *
         * NOTE: Does not enforce the expected `MaxMembers` limit on the amount of members, but
         * the weight estimations rely on it to estimate dispatchable weight.
         *
         * # WARNING:
         *
         * The `pallet-collective` can also be managed by logic outside of the pallet through the
         * implementation of the trait [`ChangeMembers`].
         * Any call to `set_members` must be careful that the member set doesn't get out of sync
         * with other logic managing the member set.
         *
         * ## Complexity:
         * - `O(MP + N)` where:
         * - `M` old-members-count (code- and governance-bounded)
         * - `N` new-members-count (code- and governance-bounded)
         * - `P` proposals-count (code-bounded)
         */
        set_members: TxDescriptor<Anonymize<I38jfk5li8iang>>;
        /**
         * Dispatch a proposal from a member using the `Member` origin.
         *
         * Origin must be a member of the collective.
         *
         * ## Complexity:
         * - `O(B + M + P)` where:
         * - `B` is `proposal` size in bytes (length-fee-bounded)
         * - `M` members-count (code-bounded)
         * - `P` complexity of dispatching `proposal`
         */
        execute: TxDescriptor<Anonymize<Iaiigoa73v0ioa>>;
        /**
         * Add a new proposal to either be voted on or executed directly.
         *
         * Requires the sender to be member.
         *
         * `threshold` determines whether `proposal` is executed directly (`threshold < 2`)
         * or put up for voting.
         *
         * ## Complexity
         * - `O(B + M + P1)` or `O(B + M + P2)` where:
         * - `B` is `proposal` size in bytes (length-fee-bounded)
         * - `M` is members-count (code- and governance-bounded)
         * - branching is influenced by `threshold` where:
         * - `P1` is proposal execution complexity (`threshold < 2`)
         * - `P2` is proposals-count (code-bounded) (`threshold >= 2`)
         */
        propose: TxDescriptor<Anonymize<Iepde6nson5v8u>>;
        /**
         * Add an aye or nay vote for the sender to the given proposal.
         *
         * Requires the sender to be a member.
         *
         * Transaction fees will be waived if the member is voting on any particular proposal
         * for the first time and the call is successful. Subsequent vote changes will charge a
         * fee.
         * ## Complexity
         * - `O(M)` where `M` is members-count (code- and governance-bounded)
         */
        vote: TxDescriptor<Anonymize<I2dtrijkm5601t>>;
        /**
         * Disapprove a proposal, close, and remove it from the system, regardless of its current
         * state.
         *
         * Must be called by the Root origin.
         *
         * Parameters:
         * * `proposal_hash`: The hash of the proposal that should be disapproved.
         *
         * ## Complexity
         * O(P) where P is the number of max proposals
         */
        disapprove_proposal: TxDescriptor<Anonymize<I2ev73t79f46tb>>;
        /**
         * Close a vote that is either approved, disapproved or whose voting period has ended.
         *
         * May be called by any signed account in order to finish voting and close the proposal.
         *
         * If called before the end of the voting period it will only close the vote if it is
         * has enough votes to be approved or disapproved.
         *
         * If called after the end of the voting period abstentions are counted as rejections
         * unless there is a prime member set and the prime member cast an approval.
         *
         * If the close operation completes successfully with disapproval, the transaction fee will
         * be waived. Otherwise execution of the approved operation will be charged to the caller.
         *
         * + `proposal_weight_bound`: The maximum amount of weight consumed by executing the closed
         * proposal.
         * + `length_bound`: The upper bound for the length of the proposal in storage. Checked via
         * `storage::read` so it is `size_of::<u32>() == 4` larger than the pure length.
         *
         * ## Complexity
         * - `O(B + M + P1 + P2)` where:
         * - `B` is `proposal` size in bytes (length-fee-bounded)
         * - `M` is members-count (code- and governance-bounded)
         * - `P1` is the complexity of `proposal` preimage.
         * - `P2` is proposal-count (code-bounded)
         */
        close: TxDescriptor<Anonymize<Ib2obgji960euh>>;
        /**
         * Disapprove the proposal and burn the cost held for storing this proposal.
         *
         * Parameters:
         * - `origin`: must be the `KillOrigin`.
         * - `proposal_hash`: The hash of the proposal that should be killed.
         *
         * Emits `Killed` and `ProposalCostBurned` if any cost was held for a given proposal.
         */
        kill: TxDescriptor<Anonymize<I2ev73t79f46tb>>;
        /**
         * Release the cost held for storing a proposal once the given proposal is completed.
         *
         * If there is no associated cost for the given proposal, this call will have no effect.
         *
         * Parameters:
         * - `origin`: must be `Signed` or `Root`.
         * - `proposal_hash`: The hash of the proposal.
         *
         * Emits `ProposalCostReleased` if any cost held for a given proposal.
         */
        release_proposal_cost: TxDescriptor<Anonymize<I2ev73t79f46tb>>;
    };
    TechnicalMembership: {
        /**
         * Add a member `who` to the set.
         *
         * May only be called from `T::AddOrigin`.
         */
        add_member: TxDescriptor<Anonymize<Icu8seopr711dn>>;
        /**
         * Remove a member `who` from the set.
         *
         * May only be called from `T::RemoveOrigin`.
         */
        remove_member: TxDescriptor<Anonymize<Icu8seopr711dn>>;
        /**
         * Swap out one member `remove` for another `add`.
         *
         * May only be called from `T::SwapOrigin`.
         *
         * Prime membership is *not* passed from `remove` to `add`, if extant.
         */
        swap_member: TxDescriptor<Anonymize<Id09aqt1ca773l>>;
        /**
         * Change the membership to a new set, disregarding the existing membership. Be nice and
         * pass `members` pre-sorted.
         *
         * May only be called from `T::ResetOrigin`.
         */
        reset_members: TxDescriptor<Anonymize<I3c63j6sh3evqn>>;
        /**
         * Swap out the sending member for some other key `new`.
         *
         * May only be called from `Signed` origin of a current member.
         *
         * Prime membership is passed from the origin account to `new`, if extant.
         */
        change_key: TxDescriptor<Anonymize<I79cmnv5q6b3p>>;
        /**
         * Set the prime member. Must be a current member.
         *
         * May only be called from `T::PrimeOrigin`.
         */
        set_prime: TxDescriptor<Anonymize<Icu8seopr711dn>>;
        /**
         * Remove the prime member if it exists.
         *
         * May only be called from `T::PrimeOrigin`.
         */
        clear_prime: TxDescriptor<undefined>;
    };
    Grandpa: {
        /**
         * Report voter equivocation/misbehavior. This method will verify the
         * equivocation proof and validate the given key ownership proof
         * against the extracted offender. If both are valid, the offence
         * will be reported.
         */
        report_equivocation: TxDescriptor<Anonymize<I7ne83r38c2sqq>>;
        /**
         * Report voter equivocation/misbehavior. This method will verify the
         * equivocation proof and validate the given key ownership proof
         * against the extracted offender. If both are valid, the offence
         * will be reported.
         *
         * This extrinsic must be called unsigned and it is expected that only
         * block authors will call it (validated in `ValidateUnsigned`), as such
         * if the block author is defined it will be defined as the equivocation
         * reporter.
         */
        report_equivocation_unsigned: TxDescriptor<Anonymize<I7ne83r38c2sqq>>;
        /**
         * Note that the current authority set of the GRANDPA finality gadget has stalled.
         *
         * This will trigger a forced authority set change at the beginning of the next session, to
         * be enacted `delay` blocks after that. The `delay` should be high enough to safely assume
         * that the block signalling the forced change will not be re-orged e.g. 1000 blocks.
         * The block production rate (which may be slowed down because of finality lagging) should
         * be taken into account when choosing the `delay`. The GRANDPA voters based on the new
         * authority will start voting on top of `best_finalized_block_number` for new finalized
         * blocks. `best_finalized_block_number` should be the highest of the latest finalized
         * block of all validators of the new authority set.
         *
         * Only callable by root.
         */
        note_stalled: TxDescriptor<Anonymize<I2hviml3snvhhn>>;
    };
    Treasury: {
        /**
         * Propose and approve a spend of treasury funds.
         *
         * ## Dispatch Origin
         *
         * Must be [`Config::SpendOrigin`] with the `Success` value being at least `amount`.
         *
         * ### Details
         * NOTE: For record-keeping purposes, the proposer is deemed to be equivalent to the
         * beneficiary.
         *
         * ### Parameters
         * - `amount`: The amount to be transferred from the treasury to the `beneficiary`.
         * - `beneficiary`: The destination account for the transfer.
         *
         * ## Events
         *
         * Emits [`Event::SpendApproved`] if successful.
         */
        spend_local: TxDescriptor<Anonymize<I7fcl4aua07ato>>;
        /**
         * Force a previously approved proposal to be removed from the approval queue.
         *
         * ## Dispatch Origin
         *
         * Must be [`Config::RejectOrigin`].
         *
         * ## Details
         *
         * The original deposit will no longer be returned.
         *
         * ### Parameters
         * - `proposal_id`: The index of a proposal
         *
         * ### Complexity
         * - O(A) where `A` is the number of approvals
         *
         * ### Errors
         * - [`Error::ProposalNotApproved`]: The `proposal_id` supplied was not found in the
         * approval queue, i.e., the proposal has not been approved. This could also mean the
         * proposal does not exist altogether, thus there is no way it would have been approved
         * in the first place.
         */
        remove_approval: TxDescriptor<Anonymize<Icm9m0qeemu66d>>;
        /**
         * Propose and approve a spend of treasury funds.
         *
         * ## Dispatch Origin
         *
         * Must be [`Config::SpendOrigin`] with the `Success` value being at least
         * `amount` of `asset_kind` in the native asset. The amount of `asset_kind` is converted
         * for assertion using the [`Config::BalanceConverter`].
         *
         * ## Details
         *
         * Create an approved spend for transferring a specific `amount` of `asset_kind` to a
         * designated beneficiary. The spend must be claimed using the `payout` dispatchable within
         * the [`Config::PayoutPeriod`].
         *
         * ### Parameters
         * - `asset_kind`: An indicator of the specific asset class to be spent.
         * - `amount`: The amount to be transferred from the treasury to the `beneficiary`.
         * - `beneficiary`: The beneficiary of the spend.
         * - `valid_from`: The block number from which the spend can be claimed. It can refer to
         * the past if the resulting spend has not yet expired according to the
         * [`Config::PayoutPeriod`]. If `None`, the spend can be claimed immediately after
         * approval.
         *
         * ## Events
         *
         * Emits [`Event::AssetSpendApproved`] if successful.
         */
        spend: TxDescriptor<Anonymize<I7t3arsaa2siad>>;
        /**
         * Claim a spend.
         *
         * ## Dispatch Origin
         *
         * Must be signed
         *
         * ## Details
         *
         * Spends must be claimed within some temporal bounds. A spend may be claimed within one
         * [`Config::PayoutPeriod`] from the `valid_from` block.
         * In case of a payout failure, the spend status must be updated with the `check_status`
         * dispatchable before retrying with the current function.
         *
         * ### Parameters
         * - `index`: The spend index.
         *
         * ## Events
         *
         * Emits [`Event::Paid`] if successful.
         */
        payout: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * Check the status of the spend and remove it from the storage if processed.
         *
         * ## Dispatch Origin
         *
         * Must be signed.
         *
         * ## Details
         *
         * The status check is a prerequisite for retrying a failed payout.
         * If a spend has either succeeded or expired, it is removed from the storage by this
         * function. In such instances, transaction fees are refunded.
         *
         * ### Parameters
         * - `index`: The spend index.
         *
         * ## Events
         *
         * Emits [`Event::PaymentFailed`] if the spend payout has failed.
         * Emits [`Event::SpendProcessed`] if the spend payout has succeed.
         */
        check_status: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * Void previously approved spend.
         *
         * ## Dispatch Origin
         *
         * Must be [`Config::RejectOrigin`].
         *
         * ## Details
         *
         * A spend void is only possible if the payout has not been attempted yet.
         *
         * ### Parameters
         * - `index`: The spend index.
         *
         * ## Events
         *
         * Emits [`Event::AssetSpendVoided`] if successful.
         */
        void_spend: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    };
    AssetRate: {
        /**
         * Initialize a conversion rate to native balance for the given asset.
         *
         * ## Complexity
         * - O(1)
         */
        create: TxDescriptor<Anonymize<Ies1efup9f14ih>>;
        /**
         * Update the conversion rate to native balance for the given asset.
         *
         * ## Complexity
         * - O(1)
         */
        update: TxDescriptor<Anonymize<Ies1efup9f14ih>>;
        /**
         * Remove an existing conversion rate to native balance for the given asset.
         *
         * ## Complexity
         * - O(1)
         */
        remove: TxDescriptor<Anonymize<Iunnigs2ph8da>>;
    };
    Contracts: {
        /**
         * Deprecated version if [`Self::call`] for use in an in-storage `Call`.
         */
        call_old_weight: TxDescriptor<Anonymize<I1vll9s18sd1u7>>;
        /**
         * Deprecated version if [`Self::instantiate_with_code`] for use in an in-storage `Call`.
         */
        instantiate_with_code_old_weight: TxDescriptor<Anonymize<I3otc7e9a35k1k>>;
        /**
         * Deprecated version if [`Self::instantiate`] for use in an in-storage `Call`.
         */
        instantiate_old_weight: TxDescriptor<Anonymize<I89ier5tb9ne0s>>;
        /**
         * Upload new `code` without instantiating a contract from it.
         *
         * If the code does not already exist a deposit is reserved from the caller
         * and unreserved only when [`Self::remove_code`] is called. The size of the reserve
         * depends on the size of the supplied `code`.
         *
         * If the code already exists in storage it will still return `Ok` and upgrades
         * the in storage version to the current
         * [`InstructionWeights::version`](InstructionWeights).
         *
         * - `determinism`: If this is set to any other value but [`Determinism::Enforced`] then
         * the only way to use this code is to delegate call into it from an offchain execution.
         * Set to [`Determinism::Enforced`] if in doubt.
         *
         * # Note
         *
         * Anyone can instantiate a contract from any uploaded code and thus prevent its removal.
         * To avoid this situation a constructor could employ access control so that it can
         * only be instantiated by permissioned entities. The same is true when uploading
         * through [`Self::instantiate_with_code`].
         *
         * Use [`Determinism::Relaxed`] exclusively for non-deterministic code. If the uploaded
         * code is deterministic, specifying [`Determinism::Relaxed`] will be disregarded and
         * result in higher gas costs.
         */
        upload_code: TxDescriptor<Anonymize<Im2f0numhevg3>>;
        /**
         * Remove the code stored under `code_hash` and refund the deposit to its owner.
         *
         * A code can only be removed by its original uploader (its owner) and only if it is
         * not used by any contract.
         */
        remove_code: TxDescriptor<Anonymize<Ib51vk42m1po4n>>;
        /**
         * Privileged function that changes the code of an existing contract.
         *
         * This takes care of updating refcounts and all other necessary operations. Returns
         * an error if either the `code_hash` or `dest` do not exist.
         *
         * # Note
         *
         * This does **not** change the address of the contract in question. This means
         * that the contract address is no longer derived from its code hash after calling
         * this dispatchable.
         */
        set_code: TxDescriptor<Anonymize<I9ck7gf792i8am>>;
        /**
         * Makes a call to an account, optionally transferring some balance.
         *
         * # Parameters
         *
         * * `dest`: Address of the contract to call.
         * * `value`: The balance to transfer from the `origin` to `dest`.
         * * `gas_limit`: The gas limit enforced when executing the constructor.
         * * `storage_deposit_limit`: The maximum amount of balance that can be charged from the
         * caller to pay for the storage consumed.
         * * `data`: The input data to pass to the contract.
         *
         * * If the account is a smart-contract account, the associated code will be
         * executed and any value will be transferred.
         * * If the account is a regular account, any value will be transferred.
         * * If no account exists and the call value is not less than `existential_deposit`,
         * a regular account will be created and any value will be transferred.
         */
        call: TxDescriptor<Anonymize<I8vgdndamv46s3>>;
        /**
         * Instantiates a new contract from the supplied `code` optionally transferring
         * some balance.
         *
         * This dispatchable has the same effect as calling [`Self::upload_code`] +
         * [`Self::instantiate`]. Bundling them together provides efficiency gains. Please
         * also check the documentation of [`Self::upload_code`].
         *
         * # Parameters
         *
         * * `value`: The balance to transfer from the `origin` to the newly created contract.
         * * `gas_limit`: The gas limit enforced when executing the constructor.
         * * `storage_deposit_limit`: The maximum amount of balance that can be charged/reserved
         * from the caller to pay for the storage consumed.
         * * `code`: The contract code to deploy in raw bytes.
         * * `data`: The input data to pass to the contract constructor.
         * * `salt`: Used for the address derivation. See [`Pallet::contract_address`].
         *
         * Instantiation is executed as follows:
         *
         * - The supplied `code` is deployed, and a `code_hash` is created for that code.
         * - If the `code_hash` already exists on the chain the underlying `code` will be shared.
         * - The destination address is computed based on the sender, code_hash and the salt.
         * - The smart-contract account is created at the computed address.
         * - The `value` is transferred to the new account.
         * - The `deploy` function is executed in the context of the newly-created account.
         */
        instantiate_with_code: TxDescriptor<Anonymize<I83fv0vi59md7i>>;
        /**
         * Instantiates a contract from a previously deployed wasm binary.
         *
         * This function is identical to [`Self::instantiate_with_code`] but without the
         * code deployment step. Instead, the `code_hash` of an on-chain deployed wasm binary
         * must be supplied.
         */
        instantiate: TxDescriptor<Anonymize<I5tjjqcdd4tae0>>;
        /**
         * When a migration is in progress, this dispatchable can be used to run migration steps.
         * Calls that contribute to advancing the migration have their fees waived, as it's helpful
         * for the chain. Note that while the migration is in progress, the pallet will also
         * leverage the `on_idle` hooks to run migration steps.
         */
        migrate: TxDescriptor<Anonymize<I1894dm1lf1ae7>>;
    };
    Sudo: {
        /**
         * Authenticates the sudo key and dispatches a function call with `Root` origin.
         */
        sudo: TxDescriptor<Anonymize<Idcpp47q096b5p>>;
        /**
         * Authenticates the sudo key and dispatches a function call with `Root` origin.
         * This function does not check the weight of the call, and instead allows the
         * Sudo user to specify the weight of the call.
         *
         * The dispatch origin for this call must be _Signed_.
         */
        sudo_unchecked_weight: TxDescriptor<Anonymize<I8ucjbjltduo5i>>;
        /**
         * Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo
         * key.
         */
        set_key: TxDescriptor<Anonymize<I79cmnv5q6b3p>>;
        /**
         * Authenticates the sudo key and dispatches a function call with `Signed` origin from
         * a given account.
         *
         * The dispatch origin for this call must be _Signed_.
         */
        sudo_as: TxDescriptor<Anonymize<I83css7r9mhvr6>>;
        /**
         * Permanently removes the sudo key.
         *
         * **This cannot be un-done.**
         */
        remove_key: TxDescriptor<undefined>;
    };
    ImOnline: {
        /**
         * ## Complexity:
         * - `O(K)` where K is length of `Keys` (heartbeat.validators_len)
         * - `O(K)`: decoding of length `K`
         */
        heartbeat: TxDescriptor<Anonymize<Idf1fcqa0qi2nt>>;
    };
    Identity: {
        /**
         * Add a registrar to the system.
         *
         * The dispatch origin for this call must be `T::RegistrarOrigin`.
         *
         * - `account`: the account of the registrar.
         *
         * Emits `RegistrarAdded` if successful.
         */
        add_registrar: TxDescriptor<Anonymize<I73kffnn32g4c7>>;
        /**
         * Remove a registrar from the system.
         *
         * The dispatch origin for this call must be `T::RegistrarOrigin`.
         *
         * The registrar's slot is tombstoned (set to `None`) rather than removed, so that the
         * `RegistrarIndex` of every other registrar — and any judgements already recorded against
         * them — stays stable. The freed index is not reused by `add_registrar`, so each removal
         * permanently consumes one slot against `MaxRegistrars` (reusing the slot would let a new
         * registrar inherit an index that historical judgements still reference).
         *
         * Deposits reserved by pending `request_judgement` calls against this registrar are
         * **not** returned; once the registrar is removed `provide_judgement` can no longer
         * release them, so affected users should reclaim their funds manually with
         * `cancel_request`.
         *
         * - `index`: the index of the registrar to remove.
         *
         * Emits `RegistrarRemoved` if successful.
         */
        remove_registrar: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * Set an account's identity information and reserve the appropriate deposit.
         *
         * If the account already has identity information, the deposit is taken as part payment
         * for the new deposit.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * - `info`: The identity information.
         *
         * Emits `IdentitySet` if successful.
         */
        set_identity: TxDescriptor<Anonymize<I2kds5jji7slh8>>;
        /**
         * Set the sub-accounts of the sender.
         *
         * Payment: Any aggregate balance reserved by previous `set_subs` calls will be returned
         * and an amount `SubAccountDeposit` will be reserved for each item in `subs`.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must have a registered
         * identity.
         *
         * - `subs`: The identity's (new) sub-accounts.
         */
        set_subs: TxDescriptor<Anonymize<Ia9mkdf6l44shb>>;
        /**
         * Clear an account's identity info and all sub-accounts and return all deposits.
         *
         * Payment: All reserved balances on the account are returned.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must have a registered
         * identity.
         *
         * Emits `IdentityCleared` if successful.
         */
        clear_identity: TxDescriptor<undefined>;
        /**
         * Request a judgement from a registrar.
         *
         * Payment: At most `max_fee` will be reserved for payment to the registrar if judgement
         * given.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must have a
         * registered identity.
         *
         * - `reg_index`: The index of the registrar whose judgement is requested.
         * - `max_fee`: The maximum fee that may be paid. This should just be auto-populated as:
         *
         * ```nocompile
         * Registrars::<T>::get().get(reg_index).unwrap().fee
         * ```
         *
         * Emits `JudgementRequested` if successful.
         */
        request_judgement: TxDescriptor<Anonymize<I9l2s4klu0831o>>;
        /**
         * Cancel a previous request.
         *
         * Payment: A previously reserved deposit is returned on success.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must have a
         * registered identity.
         *
         * - `reg_index`: The index of the registrar whose judgement is no longer requested.
         *
         * Emits `JudgementUnrequested` if successful.
         */
        cancel_request: TxDescriptor<Anonymize<I2ctrt5nqb8o7c>>;
        /**
         * Set the fee required for a judgement to be requested from a registrar.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must be the account
         * of the registrar whose index is `index`.
         *
         * - `index`: the index of the registrar whose fee is to be set.
         * - `fee`: the new fee.
         */
        set_fee: TxDescriptor<Anonymize<I711qahikocb1c>>;
        /**
         * Change the account associated with a registrar.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must be the account
         * of the registrar whose index is `index`.
         *
         * - `index`: the index of the registrar whose fee is to be set.
         * - `new`: the new account ID.
         */
        set_account_id: TxDescriptor<Anonymize<I1u3ac7lafvv5b>>;
        /**
         * Set the field information for a registrar.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must be the account
         * of the registrar whose index is `index`.
         *
         * - `index`: the index of the registrar whose fee is to be set.
         * - `fields`: the fields that the registrar concerns themselves with.
         */
        set_fields: TxDescriptor<Anonymize<Id6gojh30v9ib2>>;
        /**
         * Provide a judgement for an account's identity.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must be the account
         * of the registrar whose index is `reg_index`.
         *
         * - `reg_index`: the index of the registrar whose judgement is being made.
         * - `target`: the account whose identity the judgement is upon. This must be an account
         * with a registered identity.
         * - `judgement`: the judgement of the registrar of index `reg_index` about `target`.
         * - `identity`: The hash of the [`IdentityInformationProvider`] for that the judgement is
         * provided.
         *
         * Note: Judgements do not apply to a username.
         *
         * Emits `JudgementGiven` if successful.
         */
        provide_judgement: TxDescriptor<Anonymize<I9h4cqmadpj7l0>>;
        /**
         * Remove an account's identity and sub-account information and slash the deposits.
         *
         * Payment: Reserved balances from `set_subs` and `set_identity` are slashed and handled by
         * `Slash`. Verification request deposits are not returned; they should be cancelled
         * manually using `cancel_request`.
         *
         * The dispatch origin for this call must match `T::ForceOrigin`.
         *
         * - `target`: the account whose identity the judgement is upon. This must be an account
         * with a registered identity.
         *
         * Emits `IdentityKilled` if successful.
         */
        kill_identity: TxDescriptor<Anonymize<If31vrl50nund3>>;
        /**
         * Add the given account to the sender's subs.
         *
         * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
         * to the sender.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must have a registered
         * sub identity of `sub`.
         */
        add_sub: TxDescriptor<Anonymize<I29bkdd7n16li1>>;
        /**
         * Alter the associated name of the given sub-account.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must have a registered
         * sub identity of `sub`.
         */
        rename_sub: TxDescriptor<Anonymize<I29bkdd7n16li1>>;
        /**
         * Remove the given account from the sender's subs.
         *
         * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
         * to the sender.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must have a registered
         * sub identity of `sub`.
         */
        remove_sub: TxDescriptor<Anonymize<I9jb9hqm18runn>>;
        /**
         * Remove the sender as a sub-account.
         *
         * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
         * to the sender (*not* the original depositor).
         *
         * The dispatch origin for this call must be _Signed_ and the sender must have a registered
         * super-identity.
         *
         * NOTE: This should not normally be used, but is provided in the case that the non-
         * controller of an account is maliciously registered as a sub-account.
         */
        quit_sub: TxDescriptor<undefined>;
        /**
         * Add an `AccountId` with permission to grant usernames with a given `suffix` appended.
         *
         * The authority can grant up to `allocation` usernames. To top up the allocation or
         * change the account used to grant usernames, this call can be used with the updated
         * parameters to overwrite the existing configuration.
         */
        add_username_authority: TxDescriptor<Anonymize<I85htvo8b885h>>;
        /**
         * Remove `authority` from the username authorities.
         */
        remove_username_authority: TxDescriptor<Anonymize<I13n219aci2a5j>>;
        /**
         * Set the username for `who`. Must be called by a username authority.
         *
         * If `use_allocation` is set, the authority must have a username allocation available to
         * spend. Otherwise, the authority will need to put up a deposit for registering the
         * username.
         *
         * Users can either pre-sign their usernames or
         * accept them later.
         *
         * Usernames must:
         * - Only contain lowercase ASCII characters or digits.
         * - When combined with the suffix of the issuing authority be _less than_ the
         * `MaxUsernameLength`.
         */
        set_username_for: TxDescriptor<Anonymize<I7umt3f08lvkah>>;
        /**
         * Accept a given username that an `authority` granted. The call must include the full
         * username, as in `username.suffix`.
         */
        accept_username: TxDescriptor<Anonymize<Ie5l999tf7t2te>>;
        /**
         * Remove an expired username approval. The username was approved by an authority but never
         * accepted by the user and must now be beyond its expiration. The call must include the
         * full username, as in `username.suffix`.
         */
        remove_expired_approval: TxDescriptor<Anonymize<Ie5l999tf7t2te>>;
        /**
         * Set a given username as the primary. The username should include the suffix.
         */
        set_primary_username: TxDescriptor<Anonymize<Ie5l999tf7t2te>>;
        /**
         * Start the process of removing a username by placing it in the unbinding usernames map.
         * Once the grace period has passed, the username can be deleted by calling
         * [remove_username](crate::Call::remove_username).
         */
        unbind_username: TxDescriptor<Anonymize<Ie5l999tf7t2te>>;
        /**
         * Permanently delete a username which has been unbinding for longer than the grace period.
         * Caller is refunded the fee if the username expired and the removal was successful.
         */
        remove_username: TxDescriptor<Anonymize<Ie5l999tf7t2te>>;
        /**
         * Call with [ForceOrigin](crate::Config::ForceOrigin) privileges which deletes a username
         * and slashes any deposit associated with it.
         */
        kill_username: TxDescriptor<Anonymize<Ie5l999tf7t2te>>;
    };
    Recovery: {
        /**
         * Allows the inheritor of a recovered account to control it.
         *
         * The controller is not allowed to dispatch calls of the recovery pallet. Otherwise they
         * could mess with the recovery configuration and possibly cancel or slash attempts from
         * higher-priority friend groups.
         */
        control_inherited_account: TxDescriptor<Anonymize<I7boamina3ienb>>;
        /**
         * Revoke the inheritor of the calling (lost) account.
         *
         * This removes the inheritor entry and refunds the inheritor deposit. Can only be called
         * by the lost account itself after it regains access.
         */
        revoke_inheritor: TxDescriptor<undefined>;
        /**
         * Set the friend groups of the calling account before it lost access.
         *
         * Cannot be used while there are ongoing recovery attempts. The friends of each group
         * MUST be sorted and unique. Trying to insert two friend groups with the same set of
         * friends will result in an error.
         *
         * A `FriendGroupsChanged` event is emitted only when the new friends groups differed from
         * the old ones.
         */
        set_friend_groups: TxDescriptor<Anonymize<I7j1atkng1ju6n>>;
        /**
         * Attempt to recover a lost account by a friend within the given friend group.
         *
         * The initiator's approval is recorded automatically, so they do not need to call
         * `approve_attempt` themselves.
         *
         * Once an account has been recovered by a friend group, no friend group of equal or lower
         * priority can open a new attempt: it will fail with [`Error::HigherPriorityRecovered`].
         * Only a strictly higher-priority group (lower numerical
         * [`FriendGroup::inheritance_priority`]) can take over the inheritor.
         */
        initiate_attempt: TxDescriptor<Anonymize<I25ve5d3dgicmv>>;
        /**
         * Approve the recovery for a lost account.
         *
         * Must be called by a friend of the friend group that the recovery attempt belongs to that
         * did not yet vote. Voting is only allowed until the threshold is reached.
         * `finish_attempt` should be called after the last friend voted.
         */
        approve_attempt: TxDescriptor<Anonymize<I25ve5d3dgicmv>>;
        /**
         * Finish a recovery attempt and make the lost account accessible from the inheritor.
         *
         * Can be called by anyone who is willing to pay for the inheritor deposit.
         */
        finish_attempt: TxDescriptor<Anonymize<I25ve5d3dgicmv>>;
        /**
         * The lost account can cancel an attempt at any moment; the initiator, only after a delay.
         *
         * This will release the security deposit back to the initiator. The cancel delay must be
         * respected if the initiator calls it to prevent it from front-running the lost account
         * from slashing the attempt.
         */
        cancel_attempt: TxDescriptor<Anonymize<I25ve5d3dgicmv>>;
        /**
         * Slash a malicious recovery attempt and burn the security deposit of the initiator.
         */
        slash_attempt: TxDescriptor<Anonymize<Ia647qc1v1kokt>>;
    };
    Vesting: {
        /**
         * Unlock any vested funds of the sender account.
         *
         * The dispatch origin for this call must be _Signed_ and the sender must have funds still
         * locked under this pallet.
         *
         * Emits either `VestingCompleted` or `VestingUpdated`.
         *
         * ## Complexity
         * - `O(1)`.
         */
        vest: TxDescriptor<undefined>;
        /**
         * Unlock any vested funds of a `target` account.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * - `target`: The account whose vested funds should be unlocked. Must have funds still
         * locked under this pallet.
         *
         * Emits either `VestingCompleted` or `VestingUpdated`.
         *
         * ## Complexity
         * - `O(1)`.
         */
        vest_other: TxDescriptor<Anonymize<If31vrl50nund3>>;
        /**
         * Create a vested transfer.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * - `target`: The account receiving the vested funds.
         * - `schedule`: The vesting schedule attached to the transfer.
         *
         * Emits `VestingCreated`.
         *
         * NOTE: This will unlock all schedules through the current block.
         *
         * ## Complexity
         * - `O(1)`.
         */
        vested_transfer: TxDescriptor<Anonymize<I3usr0jpt8ovnk>>;
        /**
         * Force a vested transfer.
         *
         * The dispatch origin for this call must be _Root_.
         *
         * - `source`: The account whose funds should be transferred.
         * - `target`: The account that should be transferred the vested funds.
         * - `schedule`: The vesting schedule attached to the transfer.
         *
         * Emits `VestingCreated`.
         *
         * NOTE: This will unlock all schedules through the current block.
         *
         * ## Complexity
         * - `O(1)`.
         */
        force_vested_transfer: TxDescriptor<Anonymize<I5a5fh6anhjgu7>>;
        /**
         * Merge two vesting schedules together, creating a new vesting schedule that unlocks over
         * the highest possible start and end blocks. If both schedules have already started the
         * current block will be used as the schedule start; with the caveat that if one schedule
         * is finished by the current block, the other will be treated as the new merged schedule,
         * unmodified.
         *
         * NOTE: If `schedule1_index == schedule2_index` this is a no-op.
         * NOTE: This will unlock all schedules through the current block prior to merging.
         * NOTE: If both schedules have ended by the current block, no new schedule will be created
         * and both will be removed.
         *
         * Merged schedule attributes:
         * - `starting_block`: `MAX(schedule1.starting_block, scheduled2.starting_block,
         * current_block)`.
         * - `ending_block`: `MAX(schedule1.ending_block, schedule2.ending_block)`.
         * - `locked`: `schedule1.locked_at(current_block) + schedule2.locked_at(current_block)`.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * - `schedule1_index`: index of the first schedule to merge.
         * - `schedule2_index`: index of the second schedule to merge.
         */
        merge_schedules: TxDescriptor<Anonymize<Ict9ivhr2c5hv0>>;
        /**
         * Force remove a vesting schedule
         *
         * The dispatch origin for this call must be _Root_.
         *
         * - `target`: An account that has a vesting schedule
         * - `schedule_index`: The vesting schedule index that should be removed
         */
        force_remove_vesting_schedule: TxDescriptor<Anonymize<Ia5huiefjr1uhk>>;
    };
    Scheduler: {
        /**
         * Anonymously schedule a task.
         */
        schedule: TxDescriptor<Anonymize<I8tcieak2iq2al>>;
        /**
         * Cancel a scheduled task (named or anonymous), by providing the block it is scheduled for
         * execution in, as well as the index of the task in that block's agenda.
         *
         * In the case of a named task, it will remove it from the lookup table as well.
         */
        cancel: TxDescriptor<Anonymize<I5n4sebgkfr760>>;
        /**
         * Schedule a named task.
         */
        schedule_named: TxDescriptor<Anonymize<Ibrdskthpj262p>>;
        /**
         * Cancel a named scheduled task.
         */
        cancel_named: TxDescriptor<Anonymize<Ifs1i5fk9cqvr6>>;
        /**
         * Anonymously schedule a task after a delay.
         */
        schedule_after: TxDescriptor<Anonymize<Iciqis70karta1>>;
        /**
         * Schedule a named task after a delay.
         */
        schedule_named_after: TxDescriptor<Anonymize<Ibmq6pc54e6cek>>;
        /**
         * Set a retry configuration for a task so that, in case its scheduled run fails, it will
         * be retried after `period` blocks, for a total amount of `retries` retries or until it
         * succeeds.
         *
         * Tasks which need to be scheduled for a retry are still subject to weight metering and
         * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
         * normally while the task is retrying.
         *
         * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
         * clones of the original task. Their retry configuration will be derived from the
         * original task's configuration, but will have a lower value for `remaining` than the
         * original `total_retries`.
         *
         * This call **cannot** be used to set a retry configuration for a named task.
         */
        set_retry: TxDescriptor<Anonymize<Ieg3fd8p4pkt10>>;
        /**
         * Set a retry configuration for a named task so that, in case its scheduled run fails, it
         * will be retried after `period` blocks, for a total amount of `retries` retries or until
         * it succeeds.
         *
         * Tasks which need to be scheduled for a retry are still subject to weight metering and
         * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
         * normally while the task is retrying.
         *
         * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
         * clones of the original task. Their retry configuration will be derived from the
         * original task's configuration, but will have a lower value for `remaining` than the
         * original `total_retries`.
         *
         * This is the only way to set a retry configuration for a named task.
         */
        set_retry_named: TxDescriptor<Anonymize<I8kg5ll427kfqq>>;
        /**
         * Removes the retry configuration of a task.
         */
        cancel_retry: TxDescriptor<Anonymize<I467333262q1l9>>;
        /**
         * Cancel the retry configuration of a named task.
         */
        cancel_retry_named: TxDescriptor<Anonymize<Ifs1i5fk9cqvr6>>;
    };
    Preimage: {
        /**
         * Register a preimage on-chain.
         *
         * If the preimage was previously requested, no fees or deposits are taken for providing
         * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
         */
        note_preimage: TxDescriptor<Anonymize<I82nfqfkd48n10>>;
        /**
         * Clear an unrequested preimage from the runtime storage.
         *
         * If `len` is provided, then it will be a much cheaper operation.
         *
         * - `hash`: The hash of the preimage to be removed from the store.
         * - `len`: The length of the preimage of `hash`.
         */
        unnote_preimage: TxDescriptor<Anonymize<I1jm8m1rh9e20v>>;
        /**
         * Request a preimage be uploaded to the chain without paying any fees or deposits.
         *
         * If the preimage requests has already been provided on-chain, we unreserve any deposit
         * a user may have paid, and take the control of the preimage out of their hands.
         */
        request_preimage: TxDescriptor<Anonymize<I1jm8m1rh9e20v>>;
        /**
         * Clear a previously made request for a preimage.
         *
         * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
         */
        unrequest_preimage: TxDescriptor<Anonymize<I1jm8m1rh9e20v>>;
        /**
         * Ensure that the bulk of pre-images is upgraded.
         *
         * The caller pays no fee if at least 90% of pre-images were successfully updated.
         */
        ensure_updated: TxDescriptor<Anonymize<I3o5j3bli1pd8e>>;
    };
    Proxy: {
        /**
         * Dispatch the given `call` from an account that the sender is authorised for through
         * `add_proxy`.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * Parameters:
         * - `real`: The account that the proxy will make a call on behalf of.
         * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
         * - `call`: The call to be made by the `real` account.
         */
        proxy: TxDescriptor<Anonymize<If5vi4jv15uth>>;
        /**
         * Register a proxy account for the sender that is able to make calls on its behalf.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * Parameters:
         * - `proxy`: The account that the `caller` would like to make a proxy.
         * - `proxy_type`: The permissions allowed for this proxy account.
         * - `delay`: The announcement period required of the initial proxy. Will generally be
         * zero.
         */
        add_proxy: TxDescriptor<Anonymize<I115185tv1dn0m>>;
        /**
         * Unregister a proxy account for the sender.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * Parameters:
         * - `proxy`: The account that the `caller` would like to remove as a proxy.
         * - `proxy_type`: The permissions currently enabled for the removed proxy account.
         */
        remove_proxy: TxDescriptor<Anonymize<I115185tv1dn0m>>;
        /**
         * Unregister all proxy accounts for the sender.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * WARNING: This may be called on accounts created by `create_pure`, however if done, then
         * the unreserved fees will be inaccessible. **All access to this account will be lost.**
         */
        remove_proxies: TxDescriptor<undefined>;
        /**
         * Spawn a fresh new account that is guaranteed to be otherwise inaccessible, and
         * initialize it with a proxy of `proxy_type` for `origin` sender.
         *
         * Requires a `Signed` origin.
         *
         * - `proxy_type`: The type of the proxy that the sender will be registered as over the
         * new account. This will almost always be the most permissive `ProxyType` possible to
         * allow for maximum flexibility.
         * - `index`: A disambiguation index, in case this is called multiple times in the same
         * transaction (e.g. with `utility::batch`). Unless you're using `batch` you probably just
         * want to use `0`.
         * - `delay`: The announcement period required of the initial proxy. Will generally be
         * zero.
         *
         * Fails with `Duplicate` if this has already been called in this transaction, from the
         * same sender, with the same parameters.
         *
         * Fails if there are insufficient funds to pay for deposit.
         */
        create_pure: TxDescriptor<Anonymize<I3uo1p0na0591a>>;
        /**
         * Removes a previously spawned pure proxy.
         *
         * WARNING: **All access to this account will be lost.** Any funds held in it will be
         * inaccessible.
         *
         * Requires a `Signed` origin, and the sender account must have been created by a call to
         * `create_pure` with corresponding parameters.
         *
         * - `spawner`: The account that originally called `create_pure` to create this account.
         * - `index`: The disambiguation index originally passed to `create_pure`. Probably `0`.
         * - `proxy_type`: The proxy type originally passed to `create_pure`.
         * - `height`: The height of the chain when the call to `create_pure` was processed.
         * - `ext_index`: The extrinsic index in which the call to `create_pure` was processed.
         *
         * Fails with `NoPermission` in case the caller is not a previously created pure
         * account whose `create_pure` call has corresponding parameters.
         */
        kill_pure: TxDescriptor<Anonymize<Ifm2adqhk6cqgf>>;
        /**
         * Publish the hash of a proxy-call that will be made in the future.
         *
         * This must be called some number of blocks before the corresponding `proxy` is attempted
         * if the delay associated with the proxy relationship is greater than zero.
         *
         * No more than `MaxPending` announcements may be made at any one time.
         *
         * This will take a deposit of `AnnouncementDepositFactor` as well as
         * `AnnouncementDepositBase` if there are no other pending announcements.
         *
         * The dispatch origin for this call must be _Signed_ and a proxy of `real`.
         *
         * Parameters:
         * - `real`: The account that the proxy will make a call on behalf of.
         * - `call_hash`: The hash of the call to be made by the `real` account.
         */
        announce: TxDescriptor<Anonymize<Idj9faf6hgsdur>>;
        /**
         * Remove a given announcement.
         *
         * May be called by a proxy account to remove a call they previously announced and return
         * the deposit.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * Parameters:
         * - `real`: The account that the proxy will make a call on behalf of.
         * - `call_hash`: The hash of the call to be made by the `real` account.
         */
        remove_announcement: TxDescriptor<Anonymize<Idj9faf6hgsdur>>;
        /**
         * Remove the given announcement of a delegate.
         *
         * May be called by a target (proxied) account to remove a call that one of their delegates
         * (`delegate`) has announced they want to execute. The deposit is returned.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * Parameters:
         * - `delegate`: The account that previously announced the call.
         * - `call_hash`: The hash of the call to be made.
         */
        reject_announcement: TxDescriptor<Anonymize<I8mj1nm903hpts>>;
        /**
         * Dispatch the given `call` from an account that the sender is authorized for through
         * `add_proxy`.
         *
         * Removes any corresponding announcement(s).
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * Parameters:
         * - `real`: The account that the proxy will make a call on behalf of.
         * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
         * - `call`: The call to be made by the `real` account.
         */
        proxy_announced: TxDescriptor<Anonymize<Idmrdqtsttau2s>>;
        /**
         * Poke / Adjust deposits made for proxies and announcements based on current values.
         * This can be used by accounts to possibly lower their locked amount.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * The transaction fee is waived if the deposit amount has changed.
         *
         * Emits `DepositPoked` if successful.
         */
        poke_deposit: TxDescriptor<undefined>;
    };
    Multisig: {
        /**
         * Immediately dispatch a multi-signature call using a single approval from the caller.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * - `other_signatories`: The accounts (other than the sender) who are part of the
         * multi-signature, but do not participate in the approval process.
         * - `call`: The call to be executed.
         *
         * Result is equivalent to the dispatched result.
         *
         * ## Complexity
         * O(Z + C) where Z is the length of the call and C its execution weight.
         */
        as_multi_threshold_1: TxDescriptor<Anonymize<I9s2nog40v0irr>>;
        /**
         * Register approval for a dispatch to be made from a deterministic composite account if
         * approved by a total of `threshold - 1` of `other_signatories`.
         *
         * **If the approval threshold is met (including the sender's approval), this will
         * immediately execute the call.** This is the only way to execute a multisig call -
         * `approve_as_multi` will never trigger execution.
         *
         * Payment: `DepositBase` will be reserved if this is the first approval, plus
         * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
         * is cancelled.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * - `threshold`: The total number of approvals for this dispatch before it is executed.
         * - `other_signatories`: The accounts (other than the sender) who can approve this
         * dispatch. May not be empty.
         * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
         * not the first approval, then it must be `Some`, with the timepoint (block number and
         * transaction index) of the first approval transaction.
         * - `call`: The call to be executed.
         *
         * NOTE: For intermediate approvals (not the final approval), you should generally use
         * `approve_as_multi` instead, since it only requires a hash of the call and is more
         * efficient.
         *
         * Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise
         * on success, result is `Ok` and the result from the interior call, if it was executed,
         * may be found in the deposited `MultisigExecuted` event.
         *
         * ## Complexity
         * - `O(S + Z + Call)`.
         * - Up to one balance-reserve or unreserve operation.
         * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
         * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
         * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
         * - One encode & hash, both of complexity `O(S)`.
         * - Up to one binary search and insert (`O(logS + S)`).
         * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
         * - One event.
         * - The weight of the `call`.
         * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
         * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
         */
        as_multi: TxDescriptor<Anonymize<I3684usfj6e9tu>>;
        /**
         * Register approval for a dispatch to be made from a deterministic composite account if
         * approved by a total of `threshold - 1` of `other_signatories`.
         *
         * **This function will NEVER execute the call, even if the approval threshold is
         * reached.** It only registers approval. To actually execute the call, `as_multi` must
         * be called with the full call data by any of the signatories.
         *
         * This function is more efficient than `as_multi` for intermediate approvals since it
         * only requires the call hash, not the full call data.
         *
         * Payment: `DepositBase` will be reserved if this is the first approval, plus
         * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
         * is cancelled.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * - `threshold`: The total number of approvals for this dispatch before it is executed.
         * - `other_signatories`: The accounts (other than the sender) who can approve this
         * dispatch. May not be empty.
         * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
         * not the first approval, then it must be `Some`, with the timepoint (block number and
         * transaction index) of the first approval transaction.
         * - `call_hash`: The hash of the call to be executed.
         *
         * NOTE: To execute the call after approvals are gathered, any signatory must call
         * `as_multi` with the full call data. This function cannot execute the call.
         *
         * ## Complexity
         * - `O(S)`.
         * - Up to one balance-reserve or unreserve operation.
         * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
         * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
         * - One encode & hash, both of complexity `O(S)`.
         * - Up to one binary search and insert (`O(logS + S)`).
         * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
         * - One event.
         * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
         * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
         */
        approve_as_multi: TxDescriptor<Anonymize<Ideaemvoneh309>>;
        /**
         * Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously
         * for this operation will be unreserved on success.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * - `threshold`: The total number of approvals for this dispatch before it is executed.
         * - `other_signatories`: The accounts (other than the sender) who can approve this
         * dispatch. May not be empty.
         * - `timepoint`: The timepoint (block number and transaction index) of the first approval
         * transaction for this dispatch.
         * - `call_hash`: The hash of the call to be executed.
         *
         * ## Complexity
         * - `O(S)`.
         * - Up to one balance-reserve or unreserve operation.
         * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
         * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
         * - One encode & hash, both of complexity `O(S)`.
         * - One event.
         * - I/O: 1 read `O(S)`, one remove.
         * - Storage: removes one item.
         */
        cancel_as_multi: TxDescriptor<Anonymize<I3d9o9d7epp66v>>;
        /**
         * Poke the deposit reserved for an existing multisig operation.
         *
         * The dispatch origin for this call must be _Signed_ and must be the original depositor of
         * the multisig operation.
         *
         * The transaction fee is waived if the deposit amount has changed.
         *
         * - `threshold`: The total number of approvals needed for this multisig.
         * - `other_signatories`: The accounts (other than the sender) who are part of the
         * multisig.
         * - `call_hash`: The hash of the call this deposit is reserved for.
         *
         * Emits `DepositPoked` if successful.
         */
        poke_deposit: TxDescriptor<Anonymize<I6lqh1vgb4mcja>>;
    };
    Bounties: {
        /**
         * Propose a new bounty.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * Payment: `TipReportDepositBase` will be reserved from the origin account, as well as
         * `DataDepositPerByte` for each byte in `reason`. It will be unreserved upon approval,
         * or slashed when rejected.
         *
         * - `curator`: The curator account whom will manage this bounty.
         * - `fee`: The curator fee.
         * - `value`: The total payment amount of this bounty, curator fee included.
         * - `description`: The description of this bounty.
         */
        propose_bounty: TxDescriptor<Anonymize<I2a839vbf5817q>>;
        /**
         * Approve a bounty proposal. At a later time, the bounty will be funded and become active
         * and the original deposit will be returned.
         *
         * May only be called from `T::SpendOrigin`.
         *
         * ## Complexity
         * - O(1).
         */
        approve_bounty: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
        /**
         * Propose a curator to a funded bounty.
         *
         * May only be called from `T::SpendOrigin`.
         *
         * ## Complexity
         * - O(1).
         */
        propose_curator: TxDescriptor<Anonymize<I5rlb1eesbovji>>;
        /**
         * Unassign curator from a bounty.
         *
         * This function can only be called by the `RejectOrigin` a signed origin.
         *
         * If this function is called by the `RejectOrigin`, we assume that the curator is
         * malicious or inactive. As a result, we will slash the curator when possible.
         *
         * If the origin is the curator, we take this as a sign they are unable to do their job and
         * they willingly give up. We could slash them, but for now we allow them to recover their
         * deposit and exit without issue. (We may want to change this if it is abused.)
         *
         * Finally, the origin can be anyone if and only if the curator is "inactive". This allows
         * anyone in the community to call out that a curator is not doing their due diligence, and
         * we should pick a new curator. In this case the curator should also be slashed.
         *
         * ## Complexity
         * - O(1).
         */
        unassign_curator: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
        /**
         * Accept the curator role for a bounty.
         * A deposit will be reserved from curator and refund upon successful payout.
         *
         * May only be called from the curator.
         *
         * ## Complexity
         * - O(1).
         */
        accept_curator: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
        /**
         * Award bounty to a beneficiary account. The beneficiary will be able to claim the funds
         * after a delay.
         *
         * The dispatch origin for this call must be the curator of this bounty.
         *
         * - `bounty_id`: Bounty ID to award.
         * - `beneficiary`: The beneficiary account whom will receive the payout.
         *
         * ## Complexity
         * - O(1).
         */
        award_bounty: TxDescriptor<Anonymize<Ia96ru6pujbas0>>;
        /**
         * Claim the payout from an awarded bounty after payout delay.
         *
         * The dispatch origin for this call must be the beneficiary of this bounty.
         *
         * - `bounty_id`: Bounty ID to claim.
         *
         * ## Complexity
         * - O(1).
         */
        claim_bounty: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
        /**
         * Cancel a proposed or active bounty. All the funds will be sent to treasury and
         * the curator deposit will be unreserved if possible.
         *
         * Only `T::RejectOrigin` is able to cancel a bounty.
         *
         * - `bounty_id`: Bounty ID to cancel.
         *
         * ## Complexity
         * - O(1).
         */
        close_bounty: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
        /**
         * Extend the expiry time of an active bounty.
         *
         * The dispatch origin for this call must be the curator of this bounty.
         *
         * - `bounty_id`: Bounty ID to extend.
         * - `remark`: additional information.
         *
         * ## Complexity
         * - O(1).
         */
        extend_bounty_expiry: TxDescriptor<Anonymize<I90n6nnkpdahrh>>;
        /**
         * Approve bountry and propose a curator simultaneously.
         * This call is a shortcut to calling `approve_bounty` and `propose_curator` separately.
         *
         * May only be called from `T::SpendOrigin`.
         *
         * - `bounty_id`: Bounty ID to approve.
         * - `curator`: The curator account whom will manage this bounty.
         * - `fee`: The curator fee.
         *
         * ## Complexity
         * - O(1).
         */
        approve_bounty_with_curator: TxDescriptor<Anonymize<I5rlb1eesbovji>>;
        /**
         * Poke the deposit reserved for creating a bounty proposal.
         *
         * This can be used by accounts to update their reserved amount.
         *
         * The dispatch origin for this call must be _Signed_.
         *
         * Parameters:
         * - `bounty_id`: The bounty id for which to adjust the deposit.
         *
         * If the deposit is updated, the difference will be reserved/unreserved from the
         * proposer's account.
         *
         * The transaction is made free if the deposit is updated and paid otherwise.
         *
         * Emits `DepositPoked` if the deposit is updated.
         */
        poke_deposit: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
        /**
         * Reclaim funds stranded in a closed bounty's account back to the treasury.
         *
         * Permissionless. Moves all remaining assets from a closed bounty's account back to the
         * treasury in a single call. Which assets are swept depends on the `TransferAllAssets`
         * configuration.
         *
         * The call is free if funds were reclaimed and paid otherwise, so no-op calls cannot be
         * used to grief the network. Emits `BountyFundsReclaimed` on success.
         *
         * ## Complexity
         * - O(A) where A is the number of relevant assets configured in `TransferAllAssets`.
         */
        reclaim_bounty_funds: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
    };
    Assets: {
        /**
         * Issue a new class of fungible assets from a public origin.
         *
         * This new asset class has no assets initially and its owner is the origin.
         *
         * The origin must conform to the configured `CreateOrigin` and have sufficient funds free.
         *
         * Funds of sender are reserved by `AssetDeposit`.
         *
         * Parameters:
         * - `id`: The identifier of the new asset. This must not be currently in use to identify
         * an existing asset. If [`Config::AssetIdAllocator`] requires a specific id, this must
         * equal it.
         * - `admin`: The admin of this class of assets. The admin is the initial address of each
         * member of the asset class's admin team.
         * - `min_balance`: The minimum balance of this new asset that any single account must
         * have. If an account's balance is reduced below this, then it collapses to zero.
         *
         * Emits `Created` event when successful.
         *
         * Weight: `O(1)`
         */
        create: TxDescriptor<Anonymize<I666l8bn65t664>>;
        /**
         * Issue a new class of fungible assets from a privileged origin.
         *
         * This new asset class has no assets initially.
         *
         * The origin must conform to `ForceOrigin`.
         *
         * Unlike `create`, no funds are reserved.
         *
         * Unlike `create`, the `id` does not have to be the one required by
         * [`Config::AssetIdAllocator`]: a privileged origin may pick any `id`, which is then
         * marked as allocated.
         *
         * # Warning
         *
         * Forcing an arbitrary `id` is dangerous: the pallet only checks that `id` is not
         * *currently* in use, not that it was never used before. Reusing an id can corrupt state,
         * most severely for bridged assets, where a collision breaks the local/remote mapping.
         *
         * - `id`: The identifier of the new asset. This must not be currently in use to identify
         * an existing asset, and must never have been in use previously (see warning above).
         * - `owner`: The owner of this class of assets. The owner has full superuser permissions
         * over this asset, but may later change and configure the permissions using
         * `transfer_ownership` and `set_team`.
         * - `min_balance`: The minimum balance of this new asset that any single account must
         * have. If an account's balance is reduced below this, then it collapses to zero.
         *
         * Emits `ForceCreated` event when successful.
         *
         * Weight: `O(1)`
         */
        force_create: TxDescriptor<Anonymize<Iacnh1j2d6i0uf>>;
        /**
         * Start the process of destroying a fungible asset class.
         *
         * `start_destroy` is the first in a series of extrinsics that should be called, to allow
         * destruction of an asset class.
         *
         * The origin must conform to `ForceOrigin` or must be `Signed` by the asset's `owner`.
         *
         * - `id`: The identifier of the asset to be destroyed. This must identify an existing
         * asset.
         *
         * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
         * an account contains holds or freezes in place.
         */
        start_destroy: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Destroy all accounts associated with a given asset.
         *
         * `destroy_accounts` should only be called after `start_destroy` has been called, and the
         * asset is in a `Destroying` state.
         *
         * Due to weight restrictions, this function may need to be called multiple times to fully
         * destroy all accounts. It will destroy `RemoveItemsLimit` accounts at a time.
         *
         * - `id`: The identifier of the asset to be destroyed. This must identify an existing
         * asset.
         *
         * Each call emits the `Event::DestroyedAccounts` event.
         */
        destroy_accounts: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Destroy all approvals associated with a given asset up to the max (T::RemoveItemsLimit).
         *
         * `destroy_approvals` should only be called after `start_destroy` has been called, and the
         * asset is in a `Destroying` state.
         *
         * Due to weight restrictions, this function may need to be called multiple times to fully
         * destroy all approvals. It will destroy `RemoveItemsLimit` approvals at a time.
         *
         * - `id`: The identifier of the asset to be destroyed. This must identify an existing
         * asset.
         *
         * Each call emits the `Event::DestroyedApprovals` event.
         */
        destroy_approvals: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Complete destroying asset and unreserve currency.
         *
         * `finish_destroy` should only be called after `start_destroy` has been called, and the
         * asset is in a `Destroying` state. All accounts or approvals should be destroyed before
         * hand.
         *
         * - `id`: The identifier of the asset to be destroyed. This must identify an existing
         * asset.
         *
         * Each successful call emits the `Event::Destroyed` event.
         */
        finish_destroy: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Mint assets of a particular class.
         *
         * The origin must be Signed and the sender must be the Issuer of the asset `id`.
         *
         * - `id`: The identifier of the asset to have some amount minted.
         * - `beneficiary`: The account to be credited with the minted assets.
         * - `amount`: The amount of the asset to be minted.
         *
         * Emits `Issued` event when successful.
         *
         * Weight: `O(1)`
         * Modes: Pre-existing balance of `beneficiary`; Account pre-existence of `beneficiary`.
         */
        mint: TxDescriptor<Anonymize<Iblqeltiorjs7a>>;
        /**
         * Reduce the balance of `who` by as much as possible up to `amount` assets of `id`.
         *
         * Origin must be Signed and the sender should be the Manager of the asset `id`.
         *
         * Bails with `NoAccount` if the `who` is already dead.
         *
         * - `id`: The identifier of the asset to have some amount burned.
         * - `who`: The account to be debited from.
         * - `amount`: The maximum amount by which `who`'s balance should be reduced.
         *
         * Emits `Burned` with the actual amount burned. If this takes the balance to below the
         * minimum for the asset, then the amount burned is increased to take it to zero.
         *
         * Weight: `O(1)`
         * Modes: Post-existence of `who`; Pre & post Zombie-status of `who`.
         */
        burn: TxDescriptor<Anonymize<I387qicsot8ouv>>;
        /**
         * Move some assets from the sender account to another.
         *
         * Origin must be Signed.
         *
         * - `id`: The identifier of the asset to have some amount transferred.
         * - `target`: The account to be credited.
         * - `amount`: The amount by which the sender's balance of assets should be reduced and
         * `target`'s balance increased. The amount actually transferred may be slightly greater in
         * the case that the transfer would otherwise take the sender balance above zero but below
         * the minimum balance. Must be greater than zero.
         *
         * Emits `Transferred` with the actual amount transferred. If this takes the source balance
         * to below the minimum for the asset, then the amount transferred is increased to take it
         * to zero.
         *
         * Weight: `O(1)`
         * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
         * `target`.
         */
        transfer: TxDescriptor<Anonymize<I46pqbe97377ff>>;
        /**
         * Move some assets from the sender account to another, keeping the sender account alive.
         *
         * Origin must be Signed.
         *
         * - `id`: The identifier of the asset to have some amount transferred.
         * - `target`: The account to be credited.
         * - `amount`: The amount by which the sender's balance of assets should be reduced and
         * `target`'s balance increased. The amount actually transferred may be slightly greater in
         * the case that the transfer would otherwise take the sender balance above zero but below
         * the minimum balance. Must be greater than zero.
         *
         * Emits `Transferred` with the actual amount transferred. If this takes the source balance
         * to below the minimum for the asset, then the amount transferred is increased to take it
         * to zero.
         *
         * Weight: `O(1)`
         * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
         * `target`.
         */
        transfer_keep_alive: TxDescriptor<Anonymize<I46pqbe97377ff>>;
        /**
         * Move some assets from one account to another.
         *
         * Origin must be Signed and the sender should be the Admin of the asset `id`.
         *
         * - `id`: The identifier of the asset to have some amount transferred.
         * - `source`: The account to be debited.
         * - `dest`: The account to be credited.
         * - `amount`: The amount by which the `source`'s balance of assets should be reduced and
         * `dest`'s balance increased. The amount actually transferred may be slightly greater in
         * the case that the transfer would otherwise take the `source` balance above zero but
         * below the minimum balance. Must be greater than zero.
         *
         * Emits `Transferred` with the actual amount transferred. If this takes the source balance
         * to below the minimum for the asset, then the amount transferred is increased to take it
         * to zero.
         *
         * Weight: `O(1)`
         * Modes: Pre-existence of `dest`; Post-existence of `source`; Account pre-existence of
         * `dest`.
         */
        force_transfer: TxDescriptor<Anonymize<Iepglv06nn5df>>;
        /**
         * Disallow further unprivileged transfers of an asset `id` from an account `who`. `who`
         * must already exist as an entry in `Account`s of the asset. If you want to freeze an
         * account that does not have an entry, use `touch_other` first.
         *
         * Origin must be Signed and the sender should be the Freezer of the asset `id`.
         *
         * - `id`: The identifier of the asset to be frozen.
         * - `who`: The account to be frozen.
         *
         * Emits `Frozen`.
         *
         * Weight: `O(1)`
         */
        freeze: TxDescriptor<Anonymize<I1ihtj6h55990a>>;
        /**
         * Allow unprivileged transfers to and from an account again.
         *
         * Origin must be Signed and the sender should be the Admin of the asset `id`.
         *
         * - `id`: The identifier of the asset to be frozen.
         * - `who`: The account to be unfrozen.
         *
         * Emits `Thawed`.
         *
         * Weight: `O(1)`
         */
        thaw: TxDescriptor<Anonymize<I1ihtj6h55990a>>;
        /**
         * Disallow further unprivileged transfers for the asset class.
         *
         * Origin must be Signed and the sender should be the Freezer of the asset `id`.
         *
         * - `id`: The identifier of the asset to be frozen.
         *
         * Emits `Frozen`.
         *
         * Weight: `O(1)`
         */
        freeze_asset: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Allow unprivileged transfers for the asset again.
         *
         * Origin must be Signed and the sender should be the Admin of the asset `id`.
         *
         * - `id`: The identifier of the asset to be thawed.
         *
         * Emits `Thawed`.
         *
         * Weight: `O(1)`
         */
        thaw_asset: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Change the Owner of an asset.
         *
         * Origin must be Signed and the sender should be the Owner of the asset `id`.
         *
         * The asset (and metadata) deposit is moved from the current to the new owner. Fails
         * with [`Error::IncompleteDepositTransfer`] if a lock or freeze on the current owner
         * blocks the full transfer; clear it and retry.
         *
         * - `id`: The identifier of the asset.
         * - `owner`: The new Owner of this asset.
         *
         * Emits `OwnerChanged`.
         *
         * Weight: `O(1)`
         */
        transfer_ownership: TxDescriptor<Anonymize<Idc2iadgettsjf>>;
        /**
         * Change the Issuer, Admin and Freezer of an asset.
         *
         * Origin must be Signed and the sender should be the Owner of the asset `id`.
         *
         * - `id`: The identifier of the asset to be frozen.
         * - `issuer`: The new Issuer of this asset.
         * - `admin`: The new Admin of this asset.
         * - `freezer`: The new Freezer of this asset.
         *
         * Emits `TeamChanged`.
         *
         * Weight: `O(1)`
         */
        set_team: TxDescriptor<Anonymize<I2vkvak51mm9ip>>;
        /**
         * Set the metadata for an asset.
         *
         * Origin must be Signed and the sender should be the Owner of the asset `id`.
         *
         * Funds of sender are reserved according to the formula:
         * `MetadataDepositBase + MetadataDepositPerByte * (name.len + symbol.len)` taking into
         * account any already reserved funds.
         *
         * - `id`: The identifier of the asset to update.
         * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
         * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
         * - `decimals`: The number of decimals this asset uses to represent one unit.
         *
         * Emits `MetadataSet`.
         *
         * Weight: `O(1)`
         */
        set_metadata: TxDescriptor<Anonymize<I8hff7chabggkd>>;
        /**
         * Clear the metadata for an asset.
         *
         * Origin must be Signed and the sender should be the Owner of the asset `id`.
         *
         * Any deposit is freed for the asset owner.
         *
         * - `id`: The identifier of the asset to clear.
         *
         * Emits `MetadataCleared`.
         *
         * Weight: `O(1)`
         */
        clear_metadata: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Force the metadata for an asset to some value.
         *
         * Origin must be ForceOrigin.
         *
         * Any deposit is left alone.
         *
         * - `id`: The identifier of the asset to update.
         * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
         * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
         * - `decimals`: The number of decimals this asset uses to represent one unit.
         *
         * Emits `MetadataSet`.
         *
         * Weight: `O(N + S)` where N and S are the length of the name and symbol respectively.
         */
        force_set_metadata: TxDescriptor<Anonymize<I49i39mtj1ivbs>>;
        /**
         * Clear the metadata for an asset.
         *
         * Origin must be ForceOrigin.
         *
         * Any deposit is returned.
         *
         * - `id`: The identifier of the asset to clear.
         *
         * Emits `MetadataCleared`.
         *
         * Weight: `O(1)`
         */
        force_clear_metadata: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Alter the attributes of a given asset.
         *
         * Origin must be `ForceOrigin`.
         *
         * - `id`: The identifier of the asset.
         * - `owner`: The new Owner of this asset.
         * - `issuer`: The new Issuer of this asset.
         * - `admin`: The new Admin of this asset.
         * - `freezer`: The new Freezer of this asset.
         * - `min_balance`: The minimum balance of this new asset that any single account must
         * have. If an account's balance is reduced below this, then it collapses to zero.
         * - `is_sufficient`: Whether a non-zero balance of this asset is deposit of sufficient
         * value to account for the state bloat associated with its balance storage. If set to
         * `true`, then non-zero balances may be stored without a `consumer` reference (and thus
         * an ED in the Balances pallet or whatever else is used to control user-account state
         * growth).
         * - `is_frozen`: Whether this asset class is frozen except for permissioned/admin
         * instructions.
         *
         * Emits `AssetStatusChanged` with the identity of the asset.
         *
         * Weight: `O(1)`
         */
        force_asset_status: TxDescriptor<Anonymize<Ia38uhc66c5pu8>>;
        /**
         * Approve an amount of asset for transfer by a delegated third-party account.
         *
         * Origin must be Signed.
         *
         * Ensures that `ApprovalDeposit` worth of `Currency` is reserved from signing account
         * for the purpose of holding the approval. If some non-zero amount of assets is already
         * approved from signing account to `delegate`, then it is topped up or unreserved to
         * meet the right value.
         *
         * NOTE: The signing account does not need to own `amount` of assets at the point of
         * making this call.
         *
         * - `id`: The identifier of the asset.
         * - `delegate`: The account to delegate permission to transfer asset.
         * - `amount`: The amount of asset that may be transferred by `delegate`. If there is
         * already an approval in place, then this acts additively.
         *
         * Emits `ApprovedTransfer` on success.
         *
         * Weight: `O(1)`
         */
        approve_transfer: TxDescriptor<Anonymize<I2rqp0be9dgvpp>>;
        /**
         * Cancel all of some asset approved for delegated transfer by a third-party account.
         *
         * Origin must be Signed and there must be an approval in place between signer and
         * `delegate`.
         *
         * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
         *
         * - `id`: The identifier of the asset.
         * - `delegate`: The account delegated permission to transfer asset.
         *
         * Emits `ApprovalCancelled` on success.
         *
         * Weight: `O(1)`
         */
        cancel_approval: TxDescriptor<Anonymize<I8ehtmbkpthnh1>>;
        /**
         * Cancel all of some asset approved for delegated transfer by a third-party account.
         *
         * Origin must be either ForceOrigin or Signed origin with the signer being the Admin
         * account of the asset `id`.
         *
         * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
         *
         * - `id`: The identifier of the asset.
         * - `delegate`: The account delegated permission to transfer asset.
         *
         * Emits `ApprovalCancelled` on success.
         *
         * Weight: `O(1)`
         */
        force_cancel_approval: TxDescriptor<Anonymize<I58fkujvj9jskn>>;
        /**
         * Transfer some asset balance from a previously delegated account to some third-party
         * account.
         *
         * Origin must be Signed and there must be an approval in place by the `owner` to the
         * signer.
         *
         * If the entire amount approved for transfer is transferred, then any deposit previously
         * reserved by `approve_transfer` is unreserved.
         *
         * - `id`: The identifier of the asset.
         * - `owner`: The account which previously approved for a transfer of at least `amount` and
         * from which the asset balance will be withdrawn.
         * - `destination`: The account to which the asset balance of `amount` will be transferred.
         * - `amount`: The amount of assets to transfer.
         *
         * Emits `TransferredApproved` on success.
         *
         * Weight: `O(1)`
         */
        transfer_approved: TxDescriptor<Anonymize<I7l28cs1blokb5>>;
        /**
         * Create an asset account for non-provider assets.
         *
         * A deposit will be taken from the signer account.
         *
         * - `origin`: Must be Signed; the signer account must have sufficient funds for a deposit
         * to be taken.
         * - `id`: The identifier of the asset for the account to be created.
         *
         * Emits `Touched` event when successful.
         */
        touch: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Return the deposit (if any) of an asset account or a consumer reference (if any) of an
         * account.
         *
         * The origin must be Signed.
         *
         * - `id`: The identifier of the asset for which the caller would like the deposit
         * refunded.
         * - `allow_burn`: If `true` then assets may be destroyed in order to complete the refund.
         *
         * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
         * the asset account contains holds or freezes in place.
         *
         * Emits `Refunded` event when successful.
         */
        refund: TxDescriptor<Anonymize<I9vl5kpk0fpakt>>;
        /**
         * Sets the minimum balance of an asset.
         *
         * Only works if there aren't any accounts that are holding the asset or if
         * the new value of `min_balance` is less than the old one.
         *
         * Origin must be Signed and the sender has to be the Owner of the
         * asset `id`.
         *
         * - `id`: The identifier of the asset.
         * - `min_balance`: The new value of `min_balance`.
         *
         * Emits `AssetMinBalanceChanged` event when successful.
         */
        set_min_balance: TxDescriptor<Anonymize<I717jt61hu19b4>>;
        /**
         * Create an asset account for `who`.
         *
         * A deposit will be taken from the signer account.
         *
         * - `origin`: Must be Signed; the signer account must have sufficient funds for a deposit
         * to be taken.
         * - `id`: The identifier of the asset for the account to be created, the asset status must
         * be live.
         * - `who`: The account to be created.
         *
         * Emits `Touched` event when successful.
         */
        touch_other: TxDescriptor<Anonymize<I1ihtj6h55990a>>;
        /**
         * Return the deposit (if any) of a target asset account. Useful if you are the depositor.
         *
         * The origin must be Signed and either the account owner, depositor, or asset `Admin`. In
         * order to burn a non-zero balance of the asset, the caller must be the account and should
         * use `refund`.
         *
         * - `id`: The identifier of the asset for the account holding a deposit.
         * - `who`: The account to refund.
         *
         * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
         * the asset account contains holds or freezes in place.
         *
         * Emits `Refunded` event when successful.
         */
        refund_other: TxDescriptor<Anonymize<I1ihtj6h55990a>>;
        /**
         * Disallow further unprivileged transfers of an asset `id` to and from an account `who`.
         *
         * Origin must be Signed and the sender should be the Freezer of the asset `id`.
         *
         * - `id`: The identifier of the account's asset.
         * - `who`: The account to be unblocked.
         *
         * Emits `Blocked`.
         *
         * Weight: `O(1)`
         */
        block: TxDescriptor<Anonymize<I1ihtj6h55990a>>;
        /**
         * Transfer the entire transferable balance from the caller asset account.
         *
         * NOTE: This function only attempts to transfer _transferable_ balances. This means that
         * any held, frozen, or minimum balance (when `keep_alive` is `true`), will not be
         * transferred by this function. To ensure that this function results in a killed account,
         * you might need to prepare the account by removing any reference counters, storage
         * deposits, etc...
         *
         * The dispatch origin of this call must be Signed.
         *
         * - `id`: The identifier of the asset for the account holding a deposit.
         * - `dest`: The recipient of the transfer.
         * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
         * of the funds the asset account has, causing the sender asset account to be killed
         * (false), or transfer everything except at least the minimum balance, which will
         * guarantee to keep the sender asset account alive (true).
         */
        transfer_all: TxDescriptor<Anonymize<I6luketh4mshm4>>;
        /**
         * Sets the trusted reserve information of an asset.
         *
         * Origin must be the Owner of the asset `id`. The origin must conform to the configured
         * `CreateOrigin` or be the signed `owner` configured during asset creation.
         *
         * - `id`: The identifier of the asset.
         * - `reserves`: The full list of trusted reserves information.
         *
         * Emits `AssetMinBalanceChanged` event when successful.
         */
        set_reserves: TxDescriptor<Anonymize<Idjrs24gh0qv5l>>;
    };
    PoolAssets: {
        /**
         * Issue a new class of fungible assets from a public origin.
         *
         * This new asset class has no assets initially and its owner is the origin.
         *
         * The origin must conform to the configured `CreateOrigin` and have sufficient funds free.
         *
         * Funds of sender are reserved by `AssetDeposit`.
         *
         * Parameters:
         * - `id`: The identifier of the new asset. This must not be currently in use to identify
         * an existing asset. If [`Config::AssetIdAllocator`] requires a specific id, this must
         * equal it.
         * - `admin`: The admin of this class of assets. The admin is the initial address of each
         * member of the asset class's admin team.
         * - `min_balance`: The minimum balance of this new asset that any single account must
         * have. If an account's balance is reduced below this, then it collapses to zero.
         *
         * Emits `Created` event when successful.
         *
         * Weight: `O(1)`
         */
        create: TxDescriptor<Anonymize<I666l8bn65t664>>;
        /**
         * Issue a new class of fungible assets from a privileged origin.
         *
         * This new asset class has no assets initially.
         *
         * The origin must conform to `ForceOrigin`.
         *
         * Unlike `create`, no funds are reserved.
         *
         * Unlike `create`, the `id` does not have to be the one required by
         * [`Config::AssetIdAllocator`]: a privileged origin may pick any `id`, which is then
         * marked as allocated.
         *
         * # Warning
         *
         * Forcing an arbitrary `id` is dangerous: the pallet only checks that `id` is not
         * *currently* in use, not that it was never used before. Reusing an id can corrupt state,
         * most severely for bridged assets, where a collision breaks the local/remote mapping.
         *
         * - `id`: The identifier of the new asset. This must not be currently in use to identify
         * an existing asset, and must never have been in use previously (see warning above).
         * - `owner`: The owner of this class of assets. The owner has full superuser permissions
         * over this asset, but may later change and configure the permissions using
         * `transfer_ownership` and `set_team`.
         * - `min_balance`: The minimum balance of this new asset that any single account must
         * have. If an account's balance is reduced below this, then it collapses to zero.
         *
         * Emits `ForceCreated` event when successful.
         *
         * Weight: `O(1)`
         */
        force_create: TxDescriptor<Anonymize<Iacnh1j2d6i0uf>>;
        /**
         * Start the process of destroying a fungible asset class.
         *
         * `start_destroy` is the first in a series of extrinsics that should be called, to allow
         * destruction of an asset class.
         *
         * The origin must conform to `ForceOrigin` or must be `Signed` by the asset's `owner`.
         *
         * - `id`: The identifier of the asset to be destroyed. This must identify an existing
         * asset.
         *
         * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
         * an account contains holds or freezes in place.
         */
        start_destroy: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Destroy all accounts associated with a given asset.
         *
         * `destroy_accounts` should only be called after `start_destroy` has been called, and the
         * asset is in a `Destroying` state.
         *
         * Due to weight restrictions, this function may need to be called multiple times to fully
         * destroy all accounts. It will destroy `RemoveItemsLimit` accounts at a time.
         *
         * - `id`: The identifier of the asset to be destroyed. This must identify an existing
         * asset.
         *
         * Each call emits the `Event::DestroyedAccounts` event.
         */
        destroy_accounts: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Destroy all approvals associated with a given asset up to the max (T::RemoveItemsLimit).
         *
         * `destroy_approvals` should only be called after `start_destroy` has been called, and the
         * asset is in a `Destroying` state.
         *
         * Due to weight restrictions, this function may need to be called multiple times to fully
         * destroy all approvals. It will destroy `RemoveItemsLimit` approvals at a time.
         *
         * - `id`: The identifier of the asset to be destroyed. This must identify an existing
         * asset.
         *
         * Each call emits the `Event::DestroyedApprovals` event.
         */
        destroy_approvals: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Complete destroying asset and unreserve currency.
         *
         * `finish_destroy` should only be called after `start_destroy` has been called, and the
         * asset is in a `Destroying` state. All accounts or approvals should be destroyed before
         * hand.
         *
         * - `id`: The identifier of the asset to be destroyed. This must identify an existing
         * asset.
         *
         * Each successful call emits the `Event::Destroyed` event.
         */
        finish_destroy: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Mint assets of a particular class.
         *
         * The origin must be Signed and the sender must be the Issuer of the asset `id`.
         *
         * - `id`: The identifier of the asset to have some amount minted.
         * - `beneficiary`: The account to be credited with the minted assets.
         * - `amount`: The amount of the asset to be minted.
         *
         * Emits `Issued` event when successful.
         *
         * Weight: `O(1)`
         * Modes: Pre-existing balance of `beneficiary`; Account pre-existence of `beneficiary`.
         */
        mint: TxDescriptor<Anonymize<Iblqeltiorjs7a>>;
        /**
         * Reduce the balance of `who` by as much as possible up to `amount` assets of `id`.
         *
         * Origin must be Signed and the sender should be the Manager of the asset `id`.
         *
         * Bails with `NoAccount` if the `who` is already dead.
         *
         * - `id`: The identifier of the asset to have some amount burned.
         * - `who`: The account to be debited from.
         * - `amount`: The maximum amount by which `who`'s balance should be reduced.
         *
         * Emits `Burned` with the actual amount burned. If this takes the balance to below the
         * minimum for the asset, then the amount burned is increased to take it to zero.
         *
         * Weight: `O(1)`
         * Modes: Post-existence of `who`; Pre & post Zombie-status of `who`.
         */
        burn: TxDescriptor<Anonymize<I387qicsot8ouv>>;
        /**
         * Move some assets from the sender account to another.
         *
         * Origin must be Signed.
         *
         * - `id`: The identifier of the asset to have some amount transferred.
         * - `target`: The account to be credited.
         * - `amount`: The amount by which the sender's balance of assets should be reduced and
         * `target`'s balance increased. The amount actually transferred may be slightly greater in
         * the case that the transfer would otherwise take the sender balance above zero but below
         * the minimum balance. Must be greater than zero.
         *
         * Emits `Transferred` with the actual amount transferred. If this takes the source balance
         * to below the minimum for the asset, then the amount transferred is increased to take it
         * to zero.
         *
         * Weight: `O(1)`
         * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
         * `target`.
         */
        transfer: TxDescriptor<Anonymize<I46pqbe97377ff>>;
        /**
         * Move some assets from the sender account to another, keeping the sender account alive.
         *
         * Origin must be Signed.
         *
         * - `id`: The identifier of the asset to have some amount transferred.
         * - `target`: The account to be credited.
         * - `amount`: The amount by which the sender's balance of assets should be reduced and
         * `target`'s balance increased. The amount actually transferred may be slightly greater in
         * the case that the transfer would otherwise take the sender balance above zero but below
         * the minimum balance. Must be greater than zero.
         *
         * Emits `Transferred` with the actual amount transferred. If this takes the source balance
         * to below the minimum for the asset, then the amount transferred is increased to take it
         * to zero.
         *
         * Weight: `O(1)`
         * Modes: Pre-existence of `target`; Post-existence of sender; Account pre-existence of
         * `target`.
         */
        transfer_keep_alive: TxDescriptor<Anonymize<I46pqbe97377ff>>;
        /**
         * Move some assets from one account to another.
         *
         * Origin must be Signed and the sender should be the Admin of the asset `id`.
         *
         * - `id`: The identifier of the asset to have some amount transferred.
         * - `source`: The account to be debited.
         * - `dest`: The account to be credited.
         * - `amount`: The amount by which the `source`'s balance of assets should be reduced and
         * `dest`'s balance increased. The amount actually transferred may be slightly greater in
         * the case that the transfer would otherwise take the `source` balance above zero but
         * below the minimum balance. Must be greater than zero.
         *
         * Emits `Transferred` with the actual amount transferred. If this takes the source balance
         * to below the minimum for the asset, then the amount transferred is increased to take it
         * to zero.
         *
         * Weight: `O(1)`
         * Modes: Pre-existence of `dest`; Post-existence of `source`; Account pre-existence of
         * `dest`.
         */
        force_transfer: TxDescriptor<Anonymize<Iepglv06nn5df>>;
        /**
         * Disallow further unprivileged transfers of an asset `id` from an account `who`. `who`
         * must already exist as an entry in `Account`s of the asset. If you want to freeze an
         * account that does not have an entry, use `touch_other` first.
         *
         * Origin must be Signed and the sender should be the Freezer of the asset `id`.
         *
         * - `id`: The identifier of the asset to be frozen.
         * - `who`: The account to be frozen.
         *
         * Emits `Frozen`.
         *
         * Weight: `O(1)`
         */
        freeze: TxDescriptor<Anonymize<I1ihtj6h55990a>>;
        /**
         * Allow unprivileged transfers to and from an account again.
         *
         * Origin must be Signed and the sender should be the Admin of the asset `id`.
         *
         * - `id`: The identifier of the asset to be frozen.
         * - `who`: The account to be unfrozen.
         *
         * Emits `Thawed`.
         *
         * Weight: `O(1)`
         */
        thaw: TxDescriptor<Anonymize<I1ihtj6h55990a>>;
        /**
         * Disallow further unprivileged transfers for the asset class.
         *
         * Origin must be Signed and the sender should be the Freezer of the asset `id`.
         *
         * - `id`: The identifier of the asset to be frozen.
         *
         * Emits `Frozen`.
         *
         * Weight: `O(1)`
         */
        freeze_asset: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Allow unprivileged transfers for the asset again.
         *
         * Origin must be Signed and the sender should be the Admin of the asset `id`.
         *
         * - `id`: The identifier of the asset to be thawed.
         *
         * Emits `Thawed`.
         *
         * Weight: `O(1)`
         */
        thaw_asset: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Change the Owner of an asset.
         *
         * Origin must be Signed and the sender should be the Owner of the asset `id`.
         *
         * The asset (and metadata) deposit is moved from the current to the new owner. Fails
         * with [`Error::IncompleteDepositTransfer`] if a lock or freeze on the current owner
         * blocks the full transfer; clear it and retry.
         *
         * - `id`: The identifier of the asset.
         * - `owner`: The new Owner of this asset.
         *
         * Emits `OwnerChanged`.
         *
         * Weight: `O(1)`
         */
        transfer_ownership: TxDescriptor<Anonymize<Idc2iadgettsjf>>;
        /**
         * Change the Issuer, Admin and Freezer of an asset.
         *
         * Origin must be Signed and the sender should be the Owner of the asset `id`.
         *
         * - `id`: The identifier of the asset to be frozen.
         * - `issuer`: The new Issuer of this asset.
         * - `admin`: The new Admin of this asset.
         * - `freezer`: The new Freezer of this asset.
         *
         * Emits `TeamChanged`.
         *
         * Weight: `O(1)`
         */
        set_team: TxDescriptor<Anonymize<I2vkvak51mm9ip>>;
        /**
         * Set the metadata for an asset.
         *
         * Origin must be Signed and the sender should be the Owner of the asset `id`.
         *
         * Funds of sender are reserved according to the formula:
         * `MetadataDepositBase + MetadataDepositPerByte * (name.len + symbol.len)` taking into
         * account any already reserved funds.
         *
         * - `id`: The identifier of the asset to update.
         * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
         * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
         * - `decimals`: The number of decimals this asset uses to represent one unit.
         *
         * Emits `MetadataSet`.
         *
         * Weight: `O(1)`
         */
        set_metadata: TxDescriptor<Anonymize<I8hff7chabggkd>>;
        /**
         * Clear the metadata for an asset.
         *
         * Origin must be Signed and the sender should be the Owner of the asset `id`.
         *
         * Any deposit is freed for the asset owner.
         *
         * - `id`: The identifier of the asset to clear.
         *
         * Emits `MetadataCleared`.
         *
         * Weight: `O(1)`
         */
        clear_metadata: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Force the metadata for an asset to some value.
         *
         * Origin must be ForceOrigin.
         *
         * Any deposit is left alone.
         *
         * - `id`: The identifier of the asset to update.
         * - `name`: The user friendly name of this asset. Limited in length by `StringLimit`.
         * - `symbol`: The exchange symbol for this asset. Limited in length by `StringLimit`.
         * - `decimals`: The number of decimals this asset uses to represent one unit.
         *
         * Emits `MetadataSet`.
         *
         * Weight: `O(N + S)` where N and S are the length of the name and symbol respectively.
         */
        force_set_metadata: TxDescriptor<Anonymize<I49i39mtj1ivbs>>;
        /**
         * Clear the metadata for an asset.
         *
         * Origin must be ForceOrigin.
         *
         * Any deposit is returned.
         *
         * - `id`: The identifier of the asset to clear.
         *
         * Emits `MetadataCleared`.
         *
         * Weight: `O(1)`
         */
        force_clear_metadata: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Alter the attributes of a given asset.
         *
         * Origin must be `ForceOrigin`.
         *
         * - `id`: The identifier of the asset.
         * - `owner`: The new Owner of this asset.
         * - `issuer`: The new Issuer of this asset.
         * - `admin`: The new Admin of this asset.
         * - `freezer`: The new Freezer of this asset.
         * - `min_balance`: The minimum balance of this new asset that any single account must
         * have. If an account's balance is reduced below this, then it collapses to zero.
         * - `is_sufficient`: Whether a non-zero balance of this asset is deposit of sufficient
         * value to account for the state bloat associated with its balance storage. If set to
         * `true`, then non-zero balances may be stored without a `consumer` reference (and thus
         * an ED in the Balances pallet or whatever else is used to control user-account state
         * growth).
         * - `is_frozen`: Whether this asset class is frozen except for permissioned/admin
         * instructions.
         *
         * Emits `AssetStatusChanged` with the identity of the asset.
         *
         * Weight: `O(1)`
         */
        force_asset_status: TxDescriptor<Anonymize<Ia38uhc66c5pu8>>;
        /**
         * Approve an amount of asset for transfer by a delegated third-party account.
         *
         * Origin must be Signed.
         *
         * Ensures that `ApprovalDeposit` worth of `Currency` is reserved from signing account
         * for the purpose of holding the approval. If some non-zero amount of assets is already
         * approved from signing account to `delegate`, then it is topped up or unreserved to
         * meet the right value.
         *
         * NOTE: The signing account does not need to own `amount` of assets at the point of
         * making this call.
         *
         * - `id`: The identifier of the asset.
         * - `delegate`: The account to delegate permission to transfer asset.
         * - `amount`: The amount of asset that may be transferred by `delegate`. If there is
         * already an approval in place, then this acts additively.
         *
         * Emits `ApprovedTransfer` on success.
         *
         * Weight: `O(1)`
         */
        approve_transfer: TxDescriptor<Anonymize<I2rqp0be9dgvpp>>;
        /**
         * Cancel all of some asset approved for delegated transfer by a third-party account.
         *
         * Origin must be Signed and there must be an approval in place between signer and
         * `delegate`.
         *
         * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
         *
         * - `id`: The identifier of the asset.
         * - `delegate`: The account delegated permission to transfer asset.
         *
         * Emits `ApprovalCancelled` on success.
         *
         * Weight: `O(1)`
         */
        cancel_approval: TxDescriptor<Anonymize<I8ehtmbkpthnh1>>;
        /**
         * Cancel all of some asset approved for delegated transfer by a third-party account.
         *
         * Origin must be either ForceOrigin or Signed origin with the signer being the Admin
         * account of the asset `id`.
         *
         * Unreserves any deposit previously reserved by `approve_transfer` for the approval.
         *
         * - `id`: The identifier of the asset.
         * - `delegate`: The account delegated permission to transfer asset.
         *
         * Emits `ApprovalCancelled` on success.
         *
         * Weight: `O(1)`
         */
        force_cancel_approval: TxDescriptor<Anonymize<I58fkujvj9jskn>>;
        /**
         * Transfer some asset balance from a previously delegated account to some third-party
         * account.
         *
         * Origin must be Signed and there must be an approval in place by the `owner` to the
         * signer.
         *
         * If the entire amount approved for transfer is transferred, then any deposit previously
         * reserved by `approve_transfer` is unreserved.
         *
         * - `id`: The identifier of the asset.
         * - `owner`: The account which previously approved for a transfer of at least `amount` and
         * from which the asset balance will be withdrawn.
         * - `destination`: The account to which the asset balance of `amount` will be transferred.
         * - `amount`: The amount of assets to transfer.
         *
         * Emits `TransferredApproved` on success.
         *
         * Weight: `O(1)`
         */
        transfer_approved: TxDescriptor<Anonymize<I7l28cs1blokb5>>;
        /**
         * Create an asset account for non-provider assets.
         *
         * A deposit will be taken from the signer account.
         *
         * - `origin`: Must be Signed; the signer account must have sufficient funds for a deposit
         * to be taken.
         * - `id`: The identifier of the asset for the account to be created.
         *
         * Emits `Touched` event when successful.
         */
        touch: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
        /**
         * Return the deposit (if any) of an asset account or a consumer reference (if any) of an
         * account.
         *
         * The origin must be Signed.
         *
         * - `id`: The identifier of the asset for which the caller would like the deposit
         * refunded.
         * - `allow_burn`: If `true` then assets may be destroyed in order to complete the refund.
         *
         * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
         * the asset account contains holds or freezes in place.
         *
         * Emits `Refunded` event when successful.
         */
        refund: TxDescriptor<Anonymize<I9vl5kpk0fpakt>>;
        /**
         * Sets the minimum balance of an asset.
         *
         * Only works if there aren't any accounts that are holding the asset or if
         * the new value of `min_balance` is less than the old one.
         *
         * Origin must be Signed and the sender has to be the Owner of the
         * asset `id`.
         *
         * - `id`: The identifier of the asset.
         * - `min_balance`: The new value of `min_balance`.
         *
         * Emits `AssetMinBalanceChanged` event when successful.
         */
        set_min_balance: TxDescriptor<Anonymize<I717jt61hu19b4>>;
        /**
         * Create an asset account for `who`.
         *
         * A deposit will be taken from the signer account.
         *
         * - `origin`: Must be Signed; the signer account must have sufficient funds for a deposit
         * to be taken.
         * - `id`: The identifier of the asset for the account to be created, the asset status must
         * be live.
         * - `who`: The account to be created.
         *
         * Emits `Touched` event when successful.
         */
        touch_other: TxDescriptor<Anonymize<I1ihtj6h55990a>>;
        /**
         * Return the deposit (if any) of a target asset account. Useful if you are the depositor.
         *
         * The origin must be Signed and either the account owner, depositor, or asset `Admin`. In
         * order to burn a non-zero balance of the asset, the caller must be the account and should
         * use `refund`.
         *
         * - `id`: The identifier of the asset for the account holding a deposit.
         * - `who`: The account to refund.
         *
         * It will fail with either [`Error::ContainsHolds`] or [`Error::ContainsFreezes`] if
         * the asset account contains holds or freezes in place.
         *
         * Emits `Refunded` event when successful.
         */
        refund_other: TxDescriptor<Anonymize<I1ihtj6h55990a>>;
        /**
         * Disallow further unprivileged transfers of an asset `id` to and from an account `who`.
         *
         * Origin must be Signed and the sender should be the Freezer of the asset `id`.
         *
         * - `id`: The identifier of the account's asset.
         * - `who`: The account to be unblocked.
         *
         * Emits `Blocked`.
         *
         * Weight: `O(1)`
         */
        block: TxDescriptor<Anonymize<I1ihtj6h55990a>>;
        /**
         * Transfer the entire transferable balance from the caller asset account.
         *
         * NOTE: This function only attempts to transfer _transferable_ balances. This means that
         * any held, frozen, or minimum balance (when `keep_alive` is `true`), will not be
         * transferred by this function. To ensure that this function results in a killed account,
         * you might need to prepare the account by removing any reference counters, storage
         * deposits, etc...
         *
         * The dispatch origin of this call must be Signed.
         *
         * - `id`: The identifier of the asset for the account holding a deposit.
         * - `dest`: The recipient of the transfer.
         * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
         * of the funds the asset account has, causing the sender asset account to be killed
         * (false), or transfer everything except at least the minimum balance, which will
         * guarantee to keep the sender asset account alive (true).
         */
        transfer_all: TxDescriptor<Anonymize<I6luketh4mshm4>>;
        /**
         * Sets the trusted reserve information of an asset.
         *
         * Origin must be the Owner of the asset `id`. The origin must conform to the configured
         * `CreateOrigin` or be the signed `owner` configured during asset creation.
         *
         * - `id`: The identifier of the asset.
         * - `reserves`: The full list of trusted reserves information.
         *
         * Emits `AssetMinBalanceChanged` event when successful.
         */
        set_reserves: TxDescriptor<Anonymize<Idjrs24gh0qv5l>>;
    };
    Beefy: {
        /**
         * Report voter equivocation/misbehavior. This method will verify the
         * equivocation proof and validate the given key ownership proof
         * against the extracted offender. If both are valid, the offence
         * will be reported.
         */
        report_double_voting: TxDescriptor<Anonymize<I3pirohb0sp3ic>>;
        /**
         * Report voter equivocation/misbehavior. This method will verify the
         * equivocation proof and validate the given key ownership proof
         * against the extracted offender. If both are valid, the offence
         * will be reported.
         *
         * This extrinsic must be called unsigned and it is expected that only
         * block authors will call it (validated in `ValidateUnsigned`), as such
         * if the block author is defined it will be defined as the equivocation
         * reporter.
         */
        report_double_voting_unsigned: TxDescriptor<Anonymize<I3pirohb0sp3ic>>;
        /**
         * Reset BEEFY consensus by setting a new BEEFY genesis at `delay_in_blocks` blocks in the
         * future.
         *
         * Note: `delay_in_blocks` has to be at least 1.
         */
        set_new_genesis: TxDescriptor<Anonymize<Iemqna2uucuei9>>;
        /**
         * Report fork voting equivocation. This method will verify the equivocation proof
         * and validate the given key ownership proof against the extracted offender.
         * If both are valid, the offence will be reported.
         */
        report_fork_voting: TxDescriptor<Anonymize<Idrvp50hbkv2k2>>;
        /**
         * Report fork voting equivocation. This method will verify the equivocation proof
         * and validate the given key ownership proof against the extracted offender.
         * If both are valid, the offence will be reported.
         *
         * This extrinsic must be called unsigned and it is expected that only
         * block authors will call it (validated in `ValidateUnsigned`), as such
         * if the block author is defined it will be defined as the equivocation
         * reporter.
         */
        report_fork_voting_unsigned: TxDescriptor<Anonymize<Idrvp50hbkv2k2>>;
        /**
         * Report future block voting equivocation. This method will verify the equivocation proof
         * and validate the given key ownership proof against the extracted offender.
         * If both are valid, the offence will be reported.
         */
        report_future_block_voting: TxDescriptor<Anonymize<Ie11u326g2gsj3>>;
        /**
         * Report future block voting equivocation. This method will verify the equivocation proof
         * and validate the given key ownership proof against the extracted offender.
         * If both are valid, the offence will be reported.
         *
         * This extrinsic must be called unsigned and it is expected that only
         * block authors will call it (validated in `ValidateUnsigned`), as such
         * if the block author is defined it will be defined as the equivocation
         * reporter.
         */
        report_future_block_voting_unsigned: TxDescriptor<Anonymize<Ie11u326g2gsj3>>;
    };
    Lottery: {
        /**
         * Buy a ticket to enter the lottery.
         *
         * This extrinsic acts as a passthrough function for `call`. In all
         * situations where `call` alone would succeed, this extrinsic should
         * succeed.
         *
         * If `call` is successful, then we will attempt to purchase a ticket,
         * which may fail silently. To detect success of a ticket purchase, you
         * should listen for the `TicketBought` event.
         *
         * This extrinsic must be called by a signed origin.
         */
        buy_ticket: TxDescriptor<Anonymize<Idcpp47q096b5p>>;
        /**
         * Set calls in storage which can be used to purchase a lottery ticket.
         *
         * This function only matters if you use the `ValidateCall` implementation
         * provided by this pallet, which uses storage to determine the valid calls.
         *
         * This extrinsic must be called by the Manager origin.
         */
        set_calls: TxDescriptor<Anonymize<I9qo50msie06h7>>;
        /**
         * Start a lottery using the provided configuration.
         *
         * This extrinsic must be called by the `ManagerOrigin`.
         *
         * Parameters:
         *
         * * `price`: The cost of a single ticket.
         * * `length`: How long the lottery should run for starting at the current block.
         * * `delay`: How long after the lottery end we should wait before picking a winner.
         * * `repeat`: If the lottery should repeat when completed.
         */
        start_lottery: TxDescriptor<Anonymize<Iacbtv7bdkku2a>>;
        /**
         * If a lottery is repeating, you can use this to stop the repeat.
         * The lottery will continue to run to completion.
         *
         * This extrinsic must be called by the `ManagerOrigin`.
         */
        stop_repeat: TxDescriptor<undefined>;
    };
    Uniques: {
        /**
         * Issue a new collection of non-fungible items from a public origin.
         *
         * This new collection has no items initially and its owner is the origin.
         *
         * The origin must conform to the configured `CreateOrigin` and have sufficient funds free.
         *
         * `ItemDeposit` funds of sender are reserved.
         *
         * Parameters:
         * - `collection`: The identifier of the new collection. This must not be currently in use.
         * - `admin`: The admin of this collection. The admin is the initial address of each
         * member of the collection's admin team.
         *
         * Emits `Created` event when successful.
         *
         * Weight: `O(1)`
         */
        create: TxDescriptor<Anonymize<Ibmailvl2rk94u>>;
        /**
         * Issue a new collection of non-fungible items from a privileged origin.
         *
         * This new collection has no items initially.
         *
         * The origin must conform to `ForceOrigin`.
         *
         * Unlike `create`, no funds are reserved.
         *
         * - `collection`: The identifier of the new item. This must not be currently in use.
         * - `owner`: The owner of this collection of items. The owner has full superuser
         * permissions
         * over this item, but may later change and configure the permissions using
         * `transfer_ownership` and `set_team`.
         *
         * Emits `ForceCreated` event when successful.
         *
         * Weight: `O(1)`
         */
        force_create: TxDescriptor<Anonymize<I4b3viebhsqj08>>;
        /**
         * Destroy a collection of fungible items.
         *
         * The origin must conform to `ForceOrigin` or must be `Signed` and the sender must be the
         * owner of the `collection`.
         *
         * - `collection`: The identifier of the collection to be destroyed.
         * - `witness`: Information on the items minted in the collection. This must be
         * correct.
         *
         * Emits `Destroyed` event when successful.
         *
         * Weight: `O(n + m)` where:
         * - `n = witness.items`
         * - `m = witness.item_metadatas`
         * - `a = witness.attributes`
         */
        destroy: TxDescriptor<Anonymize<I223jg78mng8hq>>;
        /**
         * Mint an item of a particular collection.
         *
         * The origin must be Signed and the sender must be the Issuer of the `collection`.
         *
         * - `collection`: The collection of the item to be minted.
         * - `item`: The item value of the item to be minted.
         * - `beneficiary`: The initial owner of the minted item.
         *
         * Emits `Issued` event when successful.
         *
         * Weight: `O(1)`
         */
        mint: TxDescriptor<Anonymize<I8o0ghd9j8csrc>>;
        /**
         * Destroy a single item.
         *
         * Origin must be Signed and the signing account must be either:
         * - the Admin of the `collection`;
         * - the Owner of the `item`;
         *
         * - `collection`: The collection of the item to be burned.
         * - `item`: The item of the item to be burned.
         * - `check_owner`: If `Some` then the operation will fail with `WrongOwner` unless the
         * item is owned by this value.
         *
         * Emits `Burned` with the actual amount burned.
         *
         * Weight: `O(1)`
         * Modes: `check_owner.is_some()`.
         */
        burn: TxDescriptor<Anonymize<Idlch5fvavr8mh>>;
        /**
         * Move an item from the sender account to another.
         *
         * This resets the approved account of the item.
         *
         * Origin must be Signed and the signing account must be either:
         * - the Admin of the `collection`;
         * - the Owner of the `item`;
         * - the approved delegate for the `item` (in this case, the approval is reset).
         *
         * Arguments:
         * - `collection`: The collection of the item to be transferred.
         * - `item`: The item of the item to be transferred.
         * - `dest`: The account to receive ownership of the item.
         *
         * Emits `Transferred`.
         *
         * Weight: `O(1)`
         */
        transfer: TxDescriptor<Anonymize<I94er5fkmhi69n>>;
        /**
         * Reevaluate the deposits on some items.
         *
         * Origin must be Signed and the sender should be the Owner of the `collection`.
         *
         * - `collection`: The collection to be frozen.
         * - `items`: The items of the collection whose deposits will be reevaluated.
         *
         * NOTE: This exists as a best-effort function. Any items which are unknown or
         * in the case that the owner account does not have reservable funds to pay for a
         * deposit increase are ignored. Generally the owner isn't going to call this on items
         * whose existing deposit is less than the refreshed deposit as it would only cost them,
         * so it's of little consequence.
         *
         * It will still return an error in the case that the collection is unknown of the signer
         * is not permitted to call it.
         *
         * Weight: `O(items.len())`
         */
        redeposit: TxDescriptor<Anonymize<If9vko7pv0231m>>;
        /**
         * Disallow further unprivileged transfer of an item.
         *
         * Origin must be Signed and the sender should be the Freezer of the `collection`.
         *
         * - `collection`: The collection of the item to be frozen.
         * - `item`: The item of the item to be frozen.
         *
         * Emits `Frozen`.
         *
         * Weight: `O(1)`
         */
        freeze: TxDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * Re-allow unprivileged transfer of an item.
         *
         * Origin must be Signed and the sender should be the Freezer of the `collection`.
         *
         * - `collection`: The collection of the item to be thawed.
         * - `item`: The item of the item to be thawed.
         *
         * Emits `Thawed`.
         *
         * Weight: `O(1)`
         */
        thaw: TxDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * Disallow further unprivileged transfers for a whole collection.
         *
         * Origin must be Signed and the sender should be the Freezer of the `collection`.
         *
         * - `collection`: The collection to be frozen.
         *
         * Emits `CollectionFrozen`.
         *
         * Weight: `O(1)`
         */
        freeze_collection: TxDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * Re-allow unprivileged transfers for a whole collection.
         *
         * Origin must be Signed and the sender should be the Admin of the `collection`.
         *
         * - `collection`: The collection to be thawed.
         *
         * Emits `CollectionThawed`.
         *
         * Weight: `O(1)`
         */
        thaw_collection: TxDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * Change the Owner of a collection.
         *
         * Origin must be Signed and the sender should be the Owner of the `collection`.
         *
         * - `collection`: The collection whose owner should be changed.
         * - `owner`: The new Owner of this collection. They must have called
         * `set_accept_ownership` with `collection` in order for this operation to succeed.
         *
         * Emits `OwnerChanged`.
         *
         * Weight: `O(1)`
         */
        transfer_ownership: TxDescriptor<Anonymize<Idoicaqddtcrv0>>;
        /**
         * Change the Issuer, Admin and Freezer of a collection.
         *
         * Origin must be Signed and the sender should be the Owner of the `collection`.
         *
         * - `collection`: The collection whose team should be changed.
         * - `issuer`: The new Issuer of this collection.
         * - `admin`: The new Admin of this collection.
         * - `freezer`: The new Freezer of this collection.
         *
         * Emits `TeamChanged`.
         *
         * Weight: `O(1)`
         */
        set_team: TxDescriptor<Anonymize<I7pl01hchcjac6>>;
        /**
         * Approve an item to be transferred by a delegated third-party account.
         *
         * The origin must conform to `ForceOrigin` or must be `Signed` and the sender must be
         * either the owner of the `item` or the admin of the collection.
         *
         * - `collection`: The collection of the item to be approved for delegated transfer.
         * - `item`: The item of the item to be approved for delegated transfer.
         * - `delegate`: The account to delegate permission to transfer the item.
         *
         * Important NOTE: The `approved` account gets reset after each transfer.
         *
         * Emits `ApprovedTransfer` on success.
         *
         * Weight: `O(1)`
         */
        approve_transfer: TxDescriptor<Anonymize<I9q6srh8o2jnej>>;
        /**
         * Cancel the prior approval for the transfer of an item by a delegate.
         *
         * Origin must be either:
         * - the `Force` origin;
         * - `Signed` with the signer being the Admin of the `collection`;
         * - `Signed` with the signer being the Owner of the `item`;
         *
         * Arguments:
         * - `collection`: The collection of the item of whose approval will be cancelled.
         * - `item`: The item of the item of whose approval will be cancelled.
         * - `maybe_check_delegate`: If `Some` will ensure that the given account is the one to
         * which permission of transfer is delegated.
         *
         * Emits `ApprovalCancelled` on success.
         *
         * Weight: `O(1)`
         */
        cancel_approval: TxDescriptor<Anonymize<I2787020350fc3>>;
        /**
         * Alter the attributes of a given item.
         *
         * Origin must be `ForceOrigin`.
         *
         * - `collection`: The identifier of the item.
         * - `owner`: The new Owner of this item.
         * - `issuer`: The new Issuer of this item.
         * - `admin`: The new Admin of this item.
         * - `freezer`: The new Freezer of this item.
         * - `free_holding`: Whether a deposit is taken for holding an item of this collection.
         * - `is_frozen`: Whether this collection is frozen except for permissioned/admin
         * instructions.
         *
         * Emits `ItemStatusChanged` with the identity of the item.
         *
         * Weight: `O(1)`
         */
        force_item_status: TxDescriptor<Anonymize<I20n7o3khlu75i>>;
        /**
         * Set an attribute for a collection or item.
         *
         * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
         * `collection`.
         *
         * If the origin is Signed, then funds of signer are reserved according to the formula:
         * `MetadataDepositBase + DepositPerByte * (key.len + value.len)` taking into
         * account any already reserved funds.
         *
         * - `collection`: The identifier of the collection whose item's metadata to set.
         * - `maybe_item`: The identifier of the item whose metadata to set.
         * - `key`: The key of the attribute.
         * - `value`: The value to which to set the attribute.
         *
         * Emits `AttributeSet`.
         *
         * Weight: `O(1)`
         */
        set_attribute: TxDescriptor<Anonymize<I5tvvgui05tn6e>>;
        /**
         * Clear an attribute for a collection or item.
         *
         * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
         * `collection`.
         *
         * Any deposit is freed for the collection's owner.
         *
         * - `collection`: The identifier of the collection whose item's metadata to clear.
         * - `maybe_item`: The identifier of the item whose metadata to clear.
         * - `key`: The key of the attribute.
         *
         * Emits `AttributeCleared`.
         *
         * Weight: `O(1)`
         */
        clear_attribute: TxDescriptor<Anonymize<Ibal0joadvdc2h>>;
        /**
         * Set the metadata for an item.
         *
         * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
         * `collection`.
         *
         * If the origin is Signed, then funds of signer are reserved according to the formula:
         * `MetadataDepositBase + DepositPerByte * data.len` taking into
         * account any already reserved funds.
         *
         * - `collection`: The identifier of the collection whose item's metadata to set.
         * - `item`: The identifier of the item whose metadata to set.
         * - `data`: The general information of this item. Limited in length by `StringLimit`.
         * - `is_frozen`: Whether the metadata should be frozen against further changes.
         *
         * Emits `MetadataSet`.
         *
         * Weight: `O(1)`
         */
        set_metadata: TxDescriptor<Anonymize<Iceq9fmmp9aeqv>>;
        /**
         * Clear the metadata for an item.
         *
         * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
         * `item`.
         *
         * Any deposit is freed for the collection's owner.
         *
         * - `collection`: The identifier of the collection whose item's metadata to clear.
         * - `item`: The identifier of the item whose metadata to clear.
         *
         * Emits `MetadataCleared`.
         *
         * Weight: `O(1)`
         */
        clear_metadata: TxDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * Set the metadata for a collection.
         *
         * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Owner of
         * the `collection`.
         *
         * If the origin is `Signed`, then funds of signer are reserved according to the formula:
         * `MetadataDepositBase + DepositPerByte * data.len` taking into
         * account any already reserved funds.
         *
         * - `collection`: The identifier of the item whose metadata to update.
         * - `data`: The general information of this item. Limited in length by `StringLimit`.
         * - `is_frozen`: Whether the metadata should be frozen against further changes.
         *
         * Emits `CollectionMetadataSet`.
         *
         * Weight: `O(1)`
         */
        set_collection_metadata: TxDescriptor<Anonymize<I9viqhmdtuof5e>>;
        /**
         * Clear the metadata for a collection.
         *
         * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Owner of
         * the `collection`.
         *
         * Any deposit is freed for the collection's owner.
         *
         * - `collection`: The identifier of the collection whose metadata to clear.
         *
         * Emits `CollectionMetadataCleared`.
         *
         * Weight: `O(1)`
         */
        clear_collection_metadata: TxDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * Set (or reset) the acceptance of ownership for a particular account.
         *
         * Origin must be `Signed` and if `maybe_collection` is `Some`, then the signer must have a
         * provider reference.
         *
         * - `maybe_collection`: The identifier of the collection whose ownership the signer is
         * willing to accept, or if `None`, an indication that the signer is willing to accept no
         * ownership transferal.
         *
         * Emits `OwnershipAcceptanceChanged`.
         */
        set_accept_ownership: TxDescriptor<Anonymize<Ibqooroq6rr5kr>>;
        /**
         * Set the maximum amount of items a collection could have.
         *
         * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Owner of
         * the `collection`.
         *
         * Note: This function can only succeed once per collection.
         *
         * - `collection`: The identifier of the collection to change.
         * - `max_supply`: The maximum amount of items a collection could have.
         *
         * Emits `CollectionMaxSupplySet` event when successful.
         */
        set_collection_max_supply: TxDescriptor<Anonymize<I6h88h8vba22v8>>;
        /**
         * Set (or reset) the price for an item.
         *
         * Origin must be Signed and must be the owner of the asset `item`.
         *
         * - `collection`: The collection of the item.
         * - `item`: The item to set the price for.
         * - `price`: The price for the item. Pass `None`, to reset the price.
         * - `buyer`: Restricts the buy operation to a specific account.
         *
         * Emits `ItemPriceSet` on success if the price is not `None`.
         * Emits `ItemPriceRemoved` on success if the price is `None`.
         */
        set_price: TxDescriptor<Anonymize<I5g8c5alradibo>>;
        /**
         * Allows to buy an item if it's up for sale.
         *
         * Origin must be Signed and must not be the owner of the `item`.
         *
         * - `collection`: The collection of the item.
         * - `item`: The item the sender wants to buy.
         * - `bid_price`: The price the sender is willing to pay.
         *
         * Emits `ItemBought` on success.
         */
        buy_item: TxDescriptor<Anonymize<I19jiel1ftbcce>>;
    };
    Nfts: {
        /**
         * Issue a new collection of non-fungible items from a public origin.
         *
         * This new collection has no items initially and its owner is the origin.
         *
         * The origin must be Signed and the sender must have sufficient funds free.
         *
         * `CollectionDeposit` funds of sender are reserved.
         *
         * Parameters:
         * - `admin`: The admin of this collection. The admin is the initial address of each
         * member of the collection's admin team.
         *
         * Emits `Created` event when successful.
         *
         * Weight: `O(1)`
         */
        create: TxDescriptor<Anonymize<I29lgqtck418gp>>;
        /**
         * Issue a new collection of non-fungible items from a privileged origin.
         *
         * This new collection has no items initially.
         *
         * The origin must conform to `ForceOrigin`.
         *
         * Unlike `create`, no funds are reserved.
         *
         * - `owner`: The owner of this collection of items. The owner has full superuser
         * permissions over this item, but may later change and configure the permissions using
         * `transfer_ownership` and `set_team`.
         *
         * Emits `ForceCreated` event when successful.
         *
         * Weight: `O(1)`
         */
        force_create: TxDescriptor<Anonymize<Iecq2mm321jdg3>>;
        /**
         * Destroy a collection of fungible items.
         *
         * The origin must conform to `ForceOrigin` or must be `Signed` and the sender must be the
         * owner of the `collection`.
         *
         * NOTE: The collection must have 0 items to be destroyed.
         *
         * - `collection`: The identifier of the collection to be destroyed.
         * - `witness`: Information on the items minted in the collection. This must be
         * correct.
         *
         * Emits `Destroyed` event when successful.
         *
         * Weight: `O(m + c + a)` where:
         * - `m = witness.item_metadatas`
         * - `c = witness.item_configs`
         * - `a = witness.attributes`
         */
        destroy: TxDescriptor<Anonymize<I77ie723ncd4co>>;
        /**
         * Mint an item of a particular collection.
         *
         * The origin must be Signed and the sender must comply with the `mint_settings` rules.
         *
         * - `collection`: The collection of the item to be minted.
         * - `item`: An identifier of the new item.
         * - `mint_to`: Account into which the item will be minted.
         * - `witness_data`: When the mint type is `HolderOf(collection_id)`, then the owned
         * item_id from that collection needs to be provided within the witness data object. If
         * the mint price is set, then it should be additionally confirmed in the `witness_data`.
         *
         * Note: the deposit will be taken from the `origin` and not the `owner` of the `item`.
         *
         * Emits `Issued` event when successful.
         *
         * Weight: `O(1)`
         */
        mint: TxDescriptor<Anonymize<I76l9e2pop152r>>;
        /**
         * Mint an item of a particular collection from a privileged origin.
         *
         * The origin must conform to `ForceOrigin` or must be `Signed` and the sender must be the
         * Issuer of the `collection`.
         *
         * - `collection`: The collection of the item to be minted.
         * - `item`: An identifier of the new item.
         * - `mint_to`: Account into which the item will be minted.
         * - `item_config`: A config of the new item.
         *
         * Emits `Issued` event when successful.
         *
         * Weight: `O(1)`
         */
        force_mint: TxDescriptor<Anonymize<Ib7ed2pe1b1sg>>;
        /**
         * Destroy a single item.
         *
         * The origin must conform to `ForceOrigin` or must be Signed and the signing account must
         * be the owner of the `item`.
         *
         * - `collection`: The collection of the item to be burned.
         * - `item`: The item to be burned.
         *
         * Emits `Burned`.
         *
         * Weight: `O(1)`
         */
        burn: TxDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * Move an item from the sender account to another.
         *
         * Origin must be Signed and the signing account must be either:
         * - the Owner of the `item`;
         * - the approved delegate for the `item` (in this case, the approval is reset).
         *
         * Arguments:
         * - `collection`: The collection of the item to be transferred.
         * - `item`: The item to be transferred.
         * - `dest`: The account to receive ownership of the item.
         *
         * Emits `Transferred`.
         *
         * Weight: `O(1)`
         */
        transfer: TxDescriptor<Anonymize<I94er5fkmhi69n>>;
        /**
         * Re-evaluate the deposits on some items.
         *
         * Origin must be Signed and the sender should be the Owner of the `collection`.
         *
         * - `collection`: The collection of the items to be reevaluated.
         * - `items`: The items of the collection whose deposits will be reevaluated.
         *
         * NOTE: This exists as a best-effort function. Any items which are unknown or
         * in the case that the owner account does not have reservable funds to pay for a
         * deposit increase are ignored. Generally the owner isn't going to call this on items
         * whose existing deposit is less than the refreshed deposit as it would only cost them,
         * so it's of little consequence.
         *
         * It will still return an error in the case that the collection is unknown or the signer
         * is not permitted to call it.
         *
         * Weight: `O(items.len())`
         */
        redeposit: TxDescriptor<Anonymize<If9vko7pv0231m>>;
        /**
         * Disallow further unprivileged transfer of an item.
         *
         * Origin must be Signed and the sender should be the Freezer of the `collection`.
         *
         * - `collection`: The collection of the item to be changed.
         * - `item`: The item to become non-transferable.
         *
         * Emits `ItemTransferLocked`.
         *
         * Weight: `O(1)`
         */
        lock_item_transfer: TxDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * Re-allow unprivileged transfer of an item.
         *
         * Origin must be Signed and the sender should be the Freezer of the `collection`.
         *
         * - `collection`: The collection of the item to be changed.
         * - `item`: The item to become transferable.
         *
         * Emits `ItemTransferUnlocked`.
         *
         * Weight: `O(1)`
         */
        unlock_item_transfer: TxDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * Disallows specified settings for the whole collection.
         *
         * Origin must be Signed and the sender should be the Owner of the `collection`.
         *
         * - `collection`: The collection to be locked.
         * - `lock_settings`: The settings to be locked.
         *
         * Note: it's possible to only lock(set) the setting, but not to unset it.
         *
         * Emits `CollectionLocked`.
         *
         * Weight: `O(1)`
         */
        lock_collection: TxDescriptor<Anonymize<I1ahf3pvgsgbu>>;
        /**
         * Change the Owner of a collection.
         *
         * Origin must be Signed and the sender should be the Owner of the `collection`.
         *
         * - `collection`: The collection whose owner should be changed.
         * - `owner`: The new Owner of this collection. They must have called
         * `set_accept_ownership` with `collection` in order for this operation to succeed.
         *
         * Emits `OwnerChanged`.
         *
         * Weight: `O(1)`
         */
        transfer_ownership: TxDescriptor<Anonymize<Idoicaqddtcrv0>>;
        /**
         * Change the Issuer, Admin and Freezer of a collection.
         *
         * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
         * `collection`.
         *
         * Note: by setting the role to `None` only the `ForceOrigin` will be able to change it
         * after to `Some(account)`.
         *
         * - `collection`: The collection whose team should be changed.
         * - `issuer`: The new Issuer of this collection.
         * - `admin`: The new Admin of this collection.
         * - `freezer`: The new Freezer of this collection.
         *
         * Emits `TeamChanged`.
         *
         * Weight: `O(1)`
         */
        set_team: TxDescriptor<Anonymize<I9kjcceihn9imm>>;
        /**
         * Change the Owner of a collection.
         *
         * Origin must be `ForceOrigin`.
         *
         * - `collection`: The identifier of the collection.
         * - `owner`: The new Owner of this collection.
         *
         * Emits `OwnerChanged`.
         *
         * Weight: `O(1)`
         */
        force_collection_owner: TxDescriptor<Anonymize<I1esmt123kmgt3>>;
        /**
         * Change the config of a collection.
         *
         * Origin must be `ForceOrigin`.
         *
         * - `collection`: The identifier of the collection.
         * - `config`: The new config of this collection.
         *
         * Emits `CollectionConfigChanged`.
         *
         * Weight: `O(1)`
         */
        force_collection_config: TxDescriptor<Anonymize<I97qcg6i3l8gee>>;
        /**
         * Approve an item to be transferred by a delegated third-party account.
         *
         * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
         * `item`.
         *
         * - `collection`: The collection of the item to be approved for delegated transfer.
         * - `item`: The item to be approved for delegated transfer.
         * - `delegate`: The account to delegate permission to transfer the item.
         * - `maybe_deadline`: Optional deadline for the approval. Specified by providing the
         * number of blocks after which the approval will expire
         *
         * Emits `TransferApproved` on success.
         *
         * Weight: `O(1)`
         */
        approve_transfer: TxDescriptor<Anonymize<Idpvdjolib1gd>>;
        /**
         * Cancel one of the transfer approvals for a specific item.
         *
         * Origin must be either:
         * - the `Force` origin;
         * - `Signed` with the signer being the Owner of the `item`;
         *
         * Arguments:
         * - `collection`: The collection of the item of whose approval will be cancelled.
         * - `item`: The item of the collection of whose approval will be cancelled.
         * - `delegate`: The account that is going to loose their approval.
         *
         * Emits `ApprovalCancelled` on success.
         *
         * Weight: `O(1)`
         */
        cancel_approval: TxDescriptor<Anonymize<I9q6srh8o2jnej>>;
        /**
         * Cancel all the approvals of a specific item.
         *
         * Origin must be either:
         * - the `Force` origin;
         * - `Signed` with the signer being the Owner of the `item`;
         *
         * Arguments:
         * - `collection`: The collection of the item of whose approvals will be cleared.
         * - `item`: The item of the collection of whose approvals will be cleared.
         *
         * Emits `AllApprovalsCancelled` on success.
         *
         * Weight: `O(1)`
         */
        clear_all_transfer_approvals: TxDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * Disallows changing the metadata or attributes of the item.
         *
         * Origin must be either `ForceOrigin` or Signed and the sender should be the Admin
         * of the `collection`.
         *
         * - `collection`: The collection if the `item`.
         * - `item`: An item to be locked.
         * - `lock_metadata`: Specifies whether the metadata should be locked.
         * - `lock_attributes`: Specifies whether the attributes in the `CollectionOwner` namespace
         * should be locked.
         *
         * Note: `lock_attributes` affects the attributes in the `CollectionOwner` namespace only.
         * When the metadata or attributes are locked, it won't be possible the unlock them.
         *
         * Emits `ItemPropertiesLocked`.
         *
         * Weight: `O(1)`
         */
        lock_item_properties: TxDescriptor<Anonymize<I1jj31tn29ie3c>>;
        /**
         * Set an attribute for a collection or item.
         *
         * Origin must be Signed and must conform to the namespace ruleset:
         * - `CollectionOwner` namespace could be modified by the `collection` Admin only;
         * - `ItemOwner` namespace could be modified by the `maybe_item` owner only. `maybe_item`
         * should be set in that case;
         * - `Account(AccountId)` namespace could be modified only when the `origin` was given a
         * permission to do so;
         *
         * The funds of `origin` are reserved according to the formula:
         * `AttributeDepositBase + DepositPerByte * (key.len + value.len)` taking into
         * account any already reserved funds.
         *
         * - `collection`: The identifier of the collection whose item's metadata to set.
         * - `maybe_item`: The identifier of the item whose metadata to set.
         * - `namespace`: Attribute's namespace.
         * - `key`: The key of the attribute.
         * - `value`: The value to which to set the attribute.
         *
         * Emits `AttributeSet`.
         *
         * Weight: `O(1)`
         */
        set_attribute: TxDescriptor<Anonymize<I5llu6o6a0go5i>>;
        /**
         * Force-set an attribute for a collection or item.
         *
         * Origin must be `ForceOrigin`.
         *
         * If the attribute already exists and it was set by another account, the deposit
         * will be returned to the previous owner.
         *
         * - `set_as`: An optional owner of the attribute.
         * - `collection`: The identifier of the collection whose item's metadata to set.
         * - `maybe_item`: The identifier of the item whose metadata to set.
         * - `namespace`: Attribute's namespace.
         * - `key`: The key of the attribute.
         * - `value`: The value to which to set the attribute.
         *
         * Emits `AttributeSet`.
         *
         * Weight: `O(1)`
         */
        force_set_attribute: TxDescriptor<Anonymize<Ic8b8561e6t9ie>>;
        /**
         * Clear an attribute for a collection or item.
         *
         * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
         * attribute.
         *
         * Any deposit is freed for the collection's owner.
         *
         * - `collection`: The identifier of the collection whose item's metadata to clear.
         * - `maybe_item`: The identifier of the item whose metadata to clear.
         * - `namespace`: Attribute's namespace.
         * - `key`: The key of the attribute.
         *
         * Emits `AttributeCleared`.
         *
         * Weight: `O(1)`
         */
        clear_attribute: TxDescriptor<Anonymize<I93r2effh7od84>>;
        /**
         * Approve item's attributes to be changed by a delegated third-party account.
         *
         * Origin must be Signed and must be an owner of the `item`.
         *
         * - `collection`: A collection of the item.
         * - `item`: The item that holds attributes.
         * - `delegate`: The account to delegate permission to change attributes of the item.
         *
         * Emits `ItemAttributesApprovalAdded` on success.
         */
        approve_item_attributes: TxDescriptor<Anonymize<I9q6srh8o2jnej>>;
        /**
         * Cancel the previously provided approval to change item's attributes.
         * All the previously set attributes by the `delegate` will be removed.
         *
         * Origin must be Signed and must be an owner of the `item`.
         *
         * - `collection`: Collection that the item is contained within.
         * - `item`: The item that holds attributes.
         * - `delegate`: The previously approved account to remove.
         *
         * Emits `ItemAttributesApprovalRemoved` on success.
         */
        cancel_item_attributes_approval: TxDescriptor<Anonymize<I3qq76irbr2fol>>;
        /**
         * Set the metadata for an item.
         *
         * Origin must be either `ForceOrigin` or Signed and the sender should be the Admin of the
         * `collection`.
         *
         * If the origin is Signed, then funds of signer are reserved according to the formula:
         * `MetadataDepositBase + DepositPerByte * data.len` taking into
         * account any already reserved funds.
         *
         * - `collection`: The identifier of the collection whose item's metadata to set.
         * - `item`: The identifier of the item whose metadata to set.
         * - `data`: The general information of this item. Limited in length by `StringLimit`.
         *
         * Emits `ItemMetadataSet`.
         *
         * Weight: `O(1)`
         */
        set_metadata: TxDescriptor<Anonymize<Icrkms46uh8tpb>>;
        /**
         * Clear the metadata for an item.
         *
         * Origin must be either `ForceOrigin` or Signed and the sender should be the Admin of the
         * `collection`.
         *
         * Any deposit is freed for the collection's owner.
         *
         * - `collection`: The identifier of the collection whose item's metadata to clear.
         * - `item`: The identifier of the item whose metadata to clear.
         *
         * Emits `ItemMetadataCleared`.
         *
         * Weight: `O(1)`
         */
        clear_metadata: TxDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * Set the metadata for a collection.
         *
         * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Admin of
         * the `collection`.
         *
         * If the origin is `Signed`, then funds of signer are reserved according to the formula:
         * `MetadataDepositBase + DepositPerByte * data.len` taking into
         * account any already reserved funds.
         *
         * - `collection`: The identifier of the item whose metadata to update.
         * - `data`: The general information of this item. Limited in length by `StringLimit`.
         *
         * Emits `CollectionMetadataSet`.
         *
         * Weight: `O(1)`
         */
        set_collection_metadata: TxDescriptor<Anonymize<I78u60nqh0etah>>;
        /**
         * Clear the metadata for a collection.
         *
         * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Admin of
         * the `collection`.
         *
         * Any deposit is freed for the collection's owner.
         *
         * - `collection`: The identifier of the collection whose metadata to clear.
         *
         * Emits `CollectionMetadataCleared`.
         *
         * Weight: `O(1)`
         */
        clear_collection_metadata: TxDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * Set (or reset) the acceptance of ownership for a particular account.
         *
         * Origin must be `Signed` and if `maybe_collection` is `Some`, then the signer must have a
         * provider reference.
         *
         * - `maybe_collection`: The identifier of the collection whose ownership the signer is
         * willing to accept, or if `None`, an indication that the signer is willing to accept no
         * ownership transferal.
         *
         * Emits `OwnershipAcceptanceChanged`.
         */
        set_accept_ownership: TxDescriptor<Anonymize<Ibqooroq6rr5kr>>;
        /**
         * Set the maximum number of items a collection could have.
         *
         * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Owner of
         * the `collection`.
         *
         * - `collection`: The identifier of the collection to change.
         * - `max_supply`: The maximum number of items a collection could have.
         *
         * Emits `CollectionMaxSupplySet` event when successful.
         */
        set_collection_max_supply: TxDescriptor<Anonymize<I6h88h8vba22v8>>;
        /**
         * Update mint settings.
         *
         * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Issuer
         * of the `collection`.
         *
         * - `collection`: The identifier of the collection to change.
         * - `mint_settings`: The new mint settings.
         *
         * Emits `CollectionMintSettingsUpdated` event when successful.
         */
        update_mint_settings: TxDescriptor<Anonymize<I1lso3vlgherue>>;
        /**
         * Set (or reset) the price for an item.
         *
         * Origin must be Signed and must be the owner of the `item`.
         *
         * - `collection`: The collection of the item.
         * - `item`: The item to set the price for.
         * - `price`: The price for the item. Pass `None`, to reset the price.
         * - `buyer`: Restricts the buy operation to a specific account.
         *
         * Emits `ItemPriceSet` on success if the price is not `None`.
         * Emits `ItemPriceRemoved` on success if the price is `None`.
         */
        set_price: TxDescriptor<Anonymize<I5g8c5alradibo>>;
        /**
         * Allows to buy an item if it's up for sale.
         *
         * Origin must be Signed and must not be the owner of the `item`.
         *
         * - `collection`: The collection of the item.
         * - `item`: The item the sender wants to buy.
         * - `bid_price`: The price the sender is willing to pay.
         *
         * Emits `ItemBought` on success.
         */
        buy_item: TxDescriptor<Anonymize<I19jiel1ftbcce>>;
        /**
         * Allows to pay the tips.
         *
         * Origin must be Signed.
         *
         * - `tips`: Tips array.
         *
         * Emits `TipSent` on every tip transfer.
         */
        pay_tips: TxDescriptor<Anonymize<I26c8p47106toa>>;
        /**
         * Register a new atomic swap, declaring an intention to send an `item` in exchange for
         * `desired_item` from origin to target on the current blockchain.
         * The target can execute the swap during the specified `duration` of blocks (if set).
         * Additionally, the price could be set for the desired `item`.
         *
         * Origin must be Signed and must be an owner of the `item`.
         *
         * - `collection`: The collection of the item.
         * - `item`: The item an owner wants to give.
         * - `desired_collection`: The collection of the desired item.
         * - `desired_item`: The desired item an owner wants to receive.
         * - `maybe_price`: The price an owner is willing to pay or receive for the desired `item`.
         * - `duration`: A deadline for the swap. Specified by providing the number of blocks
         * after which the swap will expire.
         *
         * Emits `SwapCreated` on success.
         */
        create_swap: TxDescriptor<Anonymize<Iq82b3qvf20ne>>;
        /**
         * Cancel an atomic swap.
         *
         * Origin must be Signed.
         * Origin must be an owner of the `item` if the deadline hasn't expired.
         *
         * - `collection`: The collection of the item.
         * - `item`: The item an owner wants to give.
         *
         * Emits `SwapCancelled` on success.
         */
        cancel_swap: TxDescriptor<Anonymize<Ic3j8ku6mbsms4>>;
        /**
         * Claim an atomic swap.
         * This method executes a pending swap, that was created by a counterpart before.
         *
         * Origin must be Signed and must be an owner of the `item`.
         *
         * - `send_collection`: The collection of the item to be sent.
         * - `send_item`: The item to be sent.
         * - `receive_collection`: The collection of the item to be received.
         * - `receive_item`: The item to be received.
         * - `witness_price`: A price that was previously agreed on.
         *
         * Emits `SwapClaimed` on success.
         */
        claim_swap: TxDescriptor<Anonymize<I3nvoqsi8f05ph>>;
        /**
         * Mint an item by providing the pre-signed approval.
         *
         * Origin must be Signed.
         *
         * - `mint_data`: The pre-signed approval that consists of the information about the item,
         * its metadata, attributes, who can mint it (`None` for anyone) and until what block
         * number.
         * - `signature`: The signature of the `data` object.
         * - `signer`: The `data` object's signer. Should be an Issuer of the collection.
         *
         * Emits `Issued` on success.
         * Emits `AttributeSet` if the attributes were provided.
         * Emits `ItemMetadataSet` if the metadata was not empty.
         */
        mint_pre_signed: TxDescriptor<Anonymize<I4dr6q8duftm2l>>;
        /**
         * Set attributes for an item by providing the pre-signed approval.
         *
         * Origin must be Signed and must be an owner of the `data.item`.
         *
         * - `data`: The pre-signed approval that consists of the information about the item,
         * attributes to update and until what block number.
         * - `signature`: The signature of the `data` object.
         * - `signer`: The `data` object's signer. Should be an Admin of the collection for the
         * `CollectionOwner` namespace.
         *
         * Emits `AttributeSet` for each provided attribute.
         * Emits `ItemAttributesApprovalAdded` if the approval wasn't set before.
         * Emits `PreSignedAttributesSet` on success.
         */
        set_attributes_pre_signed: TxDescriptor<Anonymize<I4da75oqso1rqj>>;
    };
    NftFractionalization: {
        /**
         * Lock the NFT and mint a new fungible asset.
         *
         * The dispatch origin for this call must be Signed.
         * The origin must be the owner of the NFT they are trying to lock.
         *
         * `Deposit` funds of sender are reserved.
         *
         * - `nft_collection_id`: The ID used to identify the collection of the NFT.
         * Is used within the context of `pallet_nfts`.
         * - `nft_id`: The ID used to identify the NFT within the given collection.
         * Is used within the context of `pallet_nfts`.
         * - `asset_id`: The ID of the new asset. It must not exist.
         * Is used within the context of `pallet_assets`.
         * - `beneficiary`: The account that will receive the newly created asset.
         * - `fractions`: The total issuance of the newly created asset class.
         *
         * Emits `NftFractionalized` event when successful.
         */
        fractionalize: TxDescriptor<Anonymize<I8otu439cqo7jl>>;
        /**
         * Burn the total issuance of the fungible asset and return (unlock) the locked NFT.
         *
         * The dispatch origin for this call must be Signed.
         *
         * `Deposit` funds will be returned to `asset_creator`.
         *
         * - `nft_collection_id`: The ID used to identify the collection of the NFT.
         * Is used within the context of `pallet_nfts`.
         * - `nft_id`: The ID used to identify the NFT within the given collection.
         * Is used within the context of `pallet_nfts`.
         * - `asset_id`: The ID of the asset being returned and destroyed. Must match
         * the original ID of the created asset, corresponding to the NFT.
         * Is used within the context of `pallet_assets`.
         * - `beneficiary`: The account that will receive the unified NFT.
         *
         * Emits `NftUnified` event when successful.
         */
        unify: TxDescriptor<Anonymize<I7562ikckoa9b7>>;
    };
    TransactionStorage: {
        /**
         * Index and store data off chain. Minimum data size is 1 byte, maximum is
         * `MaxTransactionSize`. Data will be removed after `RetentionPeriod` blocks, unless
         * `renew` is called.
         *
         * Emits [`Stored`](Event::Stored) when successful.
         *
         * ## Complexity
         *
         * O(n*log(n)) of data size, as all data is pushed to an in-memory trie.
         */
        store: TxDescriptor<Anonymize<Itrlf5b2o2l8q>>;
        /**
         * Renew previously stored data. Parameters are the block number that contains previous
         * `store` or `renew` call and transaction index within that block. Transaction index is
         * emitted in the `Stored` or `Renewed` event. Applies same fees as `store`.
         *
         * Emits [`Renewed`](Event::Renewed) when successful.
         *
         * ## Complexity
         *
         * O(1).
         */
        renew: TxDescriptor<Anonymize<I4vj3ndsquheo1>>;
        /**
         * Check storage proof for block number `block_number() - RetentionPeriod`. If such a block
         * does not exist, the proof is expected to be `None`.
         *
         * ## Complexity
         *
         * Linear w.r.t the number of indexed transactions in the proved block for random probing.
         * There's a DB read for each transaction.
         */
        check_proof: TxDescriptor<Anonymize<I7h5kud22qmfsg>>;
    };
    VoterList: {
        /**
         * Declare that some `dislocated` account has, through rewards or penalties, sufficiently
         * changed its score that it should properly fall into a different bag than its current
         * one.
         *
         * Anyone can call this function about any potentially dislocated account.
         *
         * Will always update the stored score of `dislocated` to the correct score, based on
         * `ScoreProvider`.
         *
         * If `dislocated` does not exists, it returns an error.
         */
        rebag: TxDescriptor<Anonymize<Iepvl96j3rpblo>>;
        /**
         * Move the caller's Id directly in front of `lighter`.
         *
         * The dispatch origin for this call must be _Signed_ and can only be called by the Id of
         * the account going in front of `lighter`. Fee is payed by the origin under all
         * circumstances.
         *
         * Only works if:
         *
         * - both nodes are within the same bag,
         * - and `origin` has a greater `Score` than `lighter`.
         */
        put_in_front_of: TxDescriptor<Anonymize<Iems2cb8v3lka8>>;
        /**
         * Same as [`Pallet::put_in_front_of`], but it can be called by anyone.
         *
         * Fee is paid by the origin under all circumstances.
         */
        put_in_front_of_other: TxDescriptor<Anonymize<I4oh0ds0hgt386>>;
    };
    ChildBounties: {
        /**
         * Add a new child-bounty.
         *
         * The dispatch origin for this call must be the curator of parent
         * bounty and the parent bounty must be in "active" state.
         *
         * Child-bounty gets added successfully & fund gets transferred from
         * parent bounty to child-bounty account, if parent bounty has enough
         * funds, else the call fails.
         *
         * Upper bound to maximum number of active  child bounties that can be
         * added are managed via runtime trait config
         * [`Config::MaxActiveChildBountyCount`].
         *
         * If the call is success, the status of child-bounty is updated to
         * "Added".
         *
         * - `parent_bounty_id`: Index of parent bounty for which child-bounty is being added.
         * - `value`: Value for executing the proposal.
         * - `description`: Text description for the child-bounty.
         */
        add_child_bounty: TxDescriptor<Anonymize<I8mk5kjgn02hi8>>;
        /**
         * Propose curator for funded child-bounty.
         *
         * The dispatch origin for this call must be curator of parent bounty.
         *
         * Parent bounty must be in active state, for this child-bounty call to
         * work.
         *
         * Child-bounty must be in "Added" state, for processing the call. And
         * state of child-bounty is moved to "CuratorProposed" on successful
         * call completion.
         *
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child bounty.
         * - `curator`: Address of child-bounty curator.
         * - `fee`: payment fee to child-bounty curator for execution.
         */
        propose_curator: TxDescriptor<Anonymize<I5onpf3u0obsqb>>;
        /**
         * Accept the curator role for the child-bounty.
         *
         * The dispatch origin for this call must be the curator of this
         * child-bounty.
         *
         * A deposit will be reserved from the curator and refund upon
         * successful payout or cancellation.
         *
         * Fee for curator is deducted from curator fee of parent bounty.
         *
         * Parent bounty must be in active state, for this child-bounty call to
         * work.
         *
         * Child-bounty must be in "CuratorProposed" state, for processing the
         * call. And state of child-bounty is moved to "Active" on successful
         * call completion.
         *
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child bounty.
         */
        accept_curator: TxDescriptor<Anonymize<I2gr10p66od9ch>>;
        /**
         * Unassign curator from a child-bounty.
         *
         * The dispatch origin for this call can be either `RejectOrigin`, or
         * the curator of the parent bounty, or any signed origin.
         *
         * For the origin other than T::RejectOrigin and the child-bounty
         * curator, parent bounty must be in active state, for this call to
         * work. We allow child-bounty curator and T::RejectOrigin to execute
         * this call irrespective of the parent bounty state.
         *
         * If this function is called by the `RejectOrigin` or the
         * parent bounty curator, we assume that the child-bounty curator is
         * malicious or inactive. As a result, child-bounty curator deposit is
         * slashed.
         *
         * If the origin is the child-bounty curator, we take this as a sign
         * that they are unable to do their job, and are willingly giving up.
         * We could slash the deposit, but for now we allow them to unreserve
         * their deposit and exit without issue. (We may want to change this if
         * it is abused.)
         *
         * Finally, the origin can be anyone iff the child-bounty curator is
         * "inactive". Expiry update due of parent bounty is used to estimate
         * inactive state of child-bounty curator.
         *
         * This allows anyone in the community to call out that a child-bounty
         * curator is not doing their due diligence, and we should pick a new
         * one. In this case the child-bounty curator deposit is slashed.
         *
         * State of child-bounty is moved to Added state on successful call
         * completion.
         *
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child bounty.
         */
        unassign_curator: TxDescriptor<Anonymize<I2gr10p66od9ch>>;
        /**
         * Award child-bounty to a beneficiary.
         *
         * The beneficiary will be able to claim the funds after a delay.
         *
         * The dispatch origin for this call must be the parent curator or
         * curator of this child-bounty.
         *
         * Parent bounty must be in active state, for this child-bounty call to
         * work.
         *
         * Child-bounty must be in active state, for processing the call. And
         * state of child-bounty is moved to "PendingPayout" on successful call
         * completion.
         *
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child bounty.
         * - `beneficiary`: Beneficiary account.
         */
        award_child_bounty: TxDescriptor<Anonymize<I5d9an59q96b9e>>;
        /**
         * Claim the payout from an awarded child-bounty after payout delay.
         *
         * The dispatch origin for this call may be any signed origin.
         *
         * Call works independent of parent bounty state, No need for parent
         * bounty to be in active state.
         *
         * The Beneficiary is paid out with agreed bounty value. Curator fee is
         * paid & curator deposit is unreserved.
         *
         * Child-bounty must be in "PendingPayout" state, for processing the
         * call. And instance of child-bounty is removed from the state on
         * successful call completion.
         *
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child bounty.
         */
        claim_child_bounty: TxDescriptor<Anonymize<I2gr10p66od9ch>>;
        /**
         * Cancel a proposed or active child-bounty. Child-bounty account funds
         * are transferred to parent bounty account. The child-bounty curator
         * deposit may be unreserved if possible.
         *
         * The dispatch origin for this call must be either parent curator or
         * `T::RejectOrigin`.
         *
         * If the state of child-bounty is `Active`, curator deposit is
         * unreserved.
         *
         * If the state of child-bounty is `PendingPayout`, call fails &
         * returns `PendingPayout` error.
         *
         * For the origin other than T::RejectOrigin, parent bounty must be in
         * active state, for this child-bounty call to work. For origin
         * T::RejectOrigin execution is forced.
         *
         * Instance of child-bounty is removed from the state on successful
         * call completion.
         *
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child bounty.
         */
        close_child_bounty: TxDescriptor<Anonymize<I2gr10p66od9ch>>;
    };
    Remark: {
        /**
         * Index and store data off chain.
         */
        store: TxDescriptor<Anonymize<I8ofcg5rbj0g2c>>;
    };
    NominationPools: {
        /**
         * Stake funds with a pool. The amount to bond is delegated (or transferred based on
         * [`adapter::StakeStrategyType`]) from the member to the pool account and immediately
         * increases the pool's bond.
         *
         * The method of transferring the amount to the pool account is determined by
         * [`adapter::StakeStrategyType`]. If the pool is configured to use
         * [`adapter::StakeStrategyType::Delegate`], the funds remain in the account of
         * the `origin`, while the pool gains the right to use these funds for staking.
         *
         * # Note
         *
         * * An account can only be a member of a single pool.
         * * An account cannot join the same pool multiple times.
         * * This call will *not* dust the member account, so the member must have at least
         * `existential deposit + amount` in their account.
         * * Only a pool with [`PoolState::Open`] can be joined
         */
        join: TxDescriptor<Anonymize<Ieg1oc56mamrl5>>;
        /**
         * Bond `extra` more funds from `origin` into the pool to which they already belong.
         *
         * Additional funds can come from either the free balance of the account, of from the
         * accumulated rewards, see [`BondExtra`].
         *
         * Bonding extra funds implies an automatic payout of all pending rewards as well.
         * See `bond_extra_other` to bond pending rewards of `other` members.
         */
        bond_extra: TxDescriptor<Anonymize<I2vu5vj7173ik9>>;
        /**
         * A bonded member can use this to claim their payout based on the rewards that the pool
         * has accumulated since their last claimed payout (OR since joining if this is their first
         * time claiming rewards). The payout will be transferred to the member's account.
         *
         * The member will earn rewards pro rata based on the members stake vs the sum of the
         * members in the pools stake. Rewards do not "expire".
         *
         * See `claim_payout_other` to claim rewards on behalf of some `other` pool member.
         */
        claim_payout: TxDescriptor<undefined>;
        /**
         * Unbond up to `unbonding_points` of the `member_account`'s funds from the pool. It
         * implicitly collects the rewards one last time, since not doing so would mean some
         * rewards would be forfeited.
         *
         * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
         * account).
         *
         * # Conditions for a permissionless dispatch.
         *
         * * The pool is blocked and the caller is either the root or bouncer. This is refereed to
         * as a kick.
         * * The pool is destroying and the member is not the depositor.
         * * The pool is destroying, the member is the depositor and no other members are in the
         * pool.
         *
         * ## Conditions for permissioned dispatch (i.e. the caller is also the
         * `member_account`):
         *
         * * The caller is not the depositor.
         * * The caller is the depositor, the pool is destroying and no other members are in the
         * pool.
         *
         * # Note
         *
         * If there are too many unlocking chunks to unbond with the pool account,
         * [`Call::pool_withdraw_unbonded`] can be called to try and minimize unlocking chunks.
         * The [`StakingInterface::unbond`] will implicitly call [`Call::pool_withdraw_unbonded`]
         * to try to free chunks if necessary (ie. if unbound was called and no unlocking chunks
         * are available). However, it may not be possible to release the current unlocking chunks,
         * in which case, the result of this call will likely be the `NoMoreChunks` error from the
         * staking system.
         */
        unbond: TxDescriptor<Anonymize<Id70c5vciftf2i>>;
        /**
         * Call `withdraw_unbonded` for the pools account. This call can be made by any account.
         *
         * This is useful if there are too many unlocking chunks to call `unbond`, and some
         * can be cleared by withdrawing. In the case there are too many unlocking chunks, the user
         * would probably see an error like `NoMoreChunks` emitted from the staking system when
         * they attempt to unbond.
         */
        pool_withdraw_unbonded: TxDescriptor<Anonymize<I36uoc8t9liv80>>;
        /**
         * Withdraw unbonded funds from `member_account`. If no bonded funds can be unbonded, an
         * error is returned.
         *
         * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
         * account).
         *
         * # Conditions for a permissionless dispatch
         *
         * * The pool is in destroy mode and the target is not the depositor.
         * * The target is the depositor and they are the only member in the sub pools.
         * * The pool is blocked and the caller is either the root or bouncer.
         *
         * # Conditions for permissioned dispatch
         *
         * * The caller is the target and they are not the depositor.
         *
         * # Note
         *
         * - If the target is the depositor, the pool will be destroyed.
         * - If the pool has any pending slash, we also try to slash the member before letting them
         * withdraw. This calculation adds some weight overhead and is only defensive. In reality,
         * pool slashes must have been already applied via permissionless [`Call::apply_slash`].
         */
        withdraw_unbonded: TxDescriptor<Anonymize<I9iq45aekjq7kb>>;
        /**
         * Create a new delegation pool.
         *
         * # Arguments
         *
         * * `amount` - The amount of funds to delegate to the pool. This also acts of a sort of
         * deposit since the pools creator cannot fully unbond funds until the pool is being
         * destroyed.
         * * `index` - A disambiguation index for creating the account. Likely only useful when
         * creating multiple pools in the same extrinsic.
         * * `root` - The account to set as [`PoolRoles::root`].
         * * `nominator` - The account to set as the [`PoolRoles::nominator`].
         * * `bouncer` - The account to set as the [`PoolRoles::bouncer`].
         *
         * # Note
         *
         * In addition to `amount`, the caller will transfer the existential deposit; so the caller
         * needs at have at least `amount + existential_deposit` transferable.
         */
        create: TxDescriptor<Anonymize<I26ne2mpnrbqa5>>;
        /**
         * Create a new delegation pool with a previously used pool id
         *
         * # Arguments
         *
         * same as `create` with the inclusion of
         * * `pool_id` - `A valid PoolId.
         */
        create_with_pool_id: TxDescriptor<Anonymize<I9tlpr80ot76ta>>;
        /**
         * Nominate on behalf of the pool.
         *
         * The dispatch origin of this call must be signed by the pool nominator or the pool
         * root role.
         *
         * This directly forwards the call to an implementation of `StakingInterface` (e.g.,
         * `pallet-staking`) through [`Config::StakeAdapter`], on behalf of the bonded pool.
         *
         * # Note
         *
         * In addition to a `root` or `nominator` role of `origin`, the pool's depositor needs to
         * have at least `depositor_min_bond` in the pool to start nominating.
         */
        nominate: TxDescriptor<Anonymize<I47a2tsd2o2b1c>>;
        /**
         * Set a new state for the pool.
         *
         * If a pool is already in the `Destroying` state, then under no condition can its state
         * change again.
         *
         * The dispatch origin of this call must be either:
         *
         * 1. signed by the bouncer, or the root role of the pool,
         * 2. if the pool conditions to be open are NOT met (as described by `ok_to_be_open`), and
         * then the state of the pool can be permissionlessly changed to `Destroying`.
         */
        set_state: TxDescriptor<Anonymize<Ifc9k1s0e9nv8e>>;
        /**
         * Set a new metadata for the pool.
         *
         * The dispatch origin of this call must be signed by the bouncer, or the root role of the
         * pool.
         */
        set_metadata: TxDescriptor<Anonymize<I4ihj26hl75e5p>>;
        /**
         * Update configurations for the nomination pools. The origin for this call must be
         * [`Config::AdminOrigin`].
         *
         * # Arguments
         *
         * * `min_join_bond` - Set [`MinJoinBond`].
         * * `min_create_bond` - Set [`MinCreateBond`].
         * * `max_pools` - Set [`MaxPools`].
         * * `max_members` - Set [`MaxPoolMembers`].
         * * `max_members_per_pool` - Set [`MaxPoolMembersPerPool`].
         * * `global_max_commission` - Set [`GlobalMaxCommission`].
         */
        set_configs: TxDescriptor<Anonymize<I2dl8ekhm2t22h>>;
        /**
         * Update the roles of the pool.
         *
         * The root is the only entity that can change any of the roles, including itself,
         * excluding the depositor, who can never change.
         *
         * It emits an event, notifying UIs of the role change. This event is quite relevant to
         * most pool members and they should be informed of changes to pool roles.
         */
        update_roles: TxDescriptor<Anonymize<I13us5e5h5645o>>;
        /**
         * Chill on behalf of the pool.
         *
         * The dispatch origin of this call can be signed by the pool nominator or the pool
         * root role, same as [`Pallet::nominate`].
         *
         * This directly forwards the call to an implementation of `StakingInterface` (e.g.,
         * `pallet-staking`) through [`Config::StakeAdapter`], on behalf of the bonded pool.
         *
         * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
         * account).
         *
         * # Conditions for a permissionless dispatch:
         * * When pool depositor has less than `MinNominatorBond` staked, otherwise pool members
         * are unable to unbond.
         *
         * # Conditions for permissioned dispatch:
         * * The caller is the pool's nominator or root.
         */
        chill: TxDescriptor<Anonymize<I931cottvong90>>;
        /**
         * `origin` bonds funds from `extra` for some pool member `member` into their respective
         * pools.
         *
         * `origin` can bond extra funds from free balance or pending rewards when `origin ==
         * other`.
         *
         * In the case of `origin != other`, `origin` can only bond extra pending rewards of
         * `other` members assuming set_claim_permission for the given member is
         * `PermissionlessCompound` or `PermissionlessAll`.
         */
        bond_extra_other: TxDescriptor<Anonymize<Ic4h0nvtu79ch6>>;
        /**
         * Allows a pool member to set a claim permission to allow or disallow permissionless
         * bonding and withdrawing.
         *
         * # Arguments
         *
         * * `origin` - Member of a pool.
         * * `permission` - The permission to be applied.
         */
        set_claim_permission: TxDescriptor<Anonymize<I1ors0vru14it3>>;
        /**
         * `origin` can claim payouts on some pool member `other`'s behalf.
         *
         * Pool member `other` must have a `PermissionlessWithdraw` or `PermissionlessAll` claim
         * permission for this call to be successful.
         */
        claim_payout_other: TxDescriptor<Anonymize<I40s11r8nagn2g>>;
        /**
         * Set the commission of a pool.
         * Both a commission percentage and a commission payee must be provided in the `current`
         * tuple. Where a `current` of `None` is provided, any current commission will be removed.
         *
         * - If a `None` is supplied to `new_commission`, existing commission will be removed.
         */
        set_commission: TxDescriptor<Anonymize<I6bjj87fr5g9nl>>;
        /**
         * Set the maximum commission of a pool.
         *
         * - Initial max can be set to any `Perbill`, and only smaller values thereafter.
         * - Current commission will be lowered in the event it is higher than a new max
         * commission.
         */
        set_commission_max: TxDescriptor<Anonymize<I8cbluptqo8kbp>>;
        /**
         * Set the commission change rate for a pool.
         *
         * Initial change rate is not bounded, whereas subsequent updates can only be more
         * restrictive than the current.
         */
        set_commission_change_rate: TxDescriptor<Anonymize<I81cc4plffa1dm>>;
        /**
         * Claim pending commission.
         *
         * The `root` role of the pool is _always_ allowed to claim the pool's commission.
         *
         * If the pool has set `CommissionClaimPermission::Permissionless`, then any account can
         * trigger the process of claiming the pool's commission.
         *
         * If the pool has set its `CommissionClaimPermission` to `Account(acc)`, then only
         * accounts
         * * `acc`, and
         * * the pool's root account
         *
         * may call this extrinsic on behalf of the pool.
         *
         * Pending commissions are paid out and added to the total claimed commission.
         * The total pending commission is reset to zero.
         */
        claim_commission: TxDescriptor<Anonymize<I931cottvong90>>;
        /**
         * Top up the deficit or withdraw the excess ED from the pool.
         *
         * When a pool is created, the pool depositor transfers ED to the reward account of the
         * pool. ED is subject to change and over time, the deposit in the reward account may be
         * insufficient to cover the ED deficit of the pool or vice-versa where there is excess
         * deposit to the pool. This call allows anyone to adjust the ED deposit of the
         * pool by either topping up the deficit or claiming the excess.
         */
        adjust_pool_deposit: TxDescriptor<Anonymize<I931cottvong90>>;
        /**
         * Set or remove a pool's commission claim permission.
         *
         * Determines who can claim the pool's pending commission. Only the `Root` role of the pool
         * is able to configure commission claim permissions.
         */
        set_commission_claim_permission: TxDescriptor<Anonymize<I3ihan8icf0c5k>>;
        /**
         * Apply a pending slash on a member.
         *
         * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
         * [`adapter::StakeStrategyType::Delegate`].
         *
         * The pending slash amount of the member must be equal or more than `ExistentialDeposit`.
         * This call can be dispatched permissionlessly (i.e. by any account). If the execution
         * is successful, fee is refunded and caller may be rewarded with a part of the slash
         * based on the [`crate::pallet::Config::StakeAdapter`] configuration.
         */
        apply_slash: TxDescriptor<Anonymize<I7aouqn0g9m7gc>>;
        /**
         * Migrates delegated funds from the pool account to the `member_account`.
         *
         * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
         * [`adapter::StakeStrategyType::Delegate`].
         *
         * This is a permission-less call and refunds any fee if claim is successful.
         *
         * If the pool has migrated to delegation based staking, the staked tokens of pool members
         * can be moved and held in their own account. See [`adapter::DelegateStake`]
         */
        migrate_delegation: TxDescriptor<Anonymize<I7aouqn0g9m7gc>>;
        /**
         * Migrate pool from [`adapter::StakeStrategyType::Transfer`] to
         * [`adapter::StakeStrategyType::Delegate`].
         *
         * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
         * [`adapter::StakeStrategyType::Delegate`].
         *
         * This call can be dispatched permissionlessly, and refunds any fee if successful.
         *
         * If the pool has already migrated to delegation based staking, this call will fail.
         */
        migrate_pool_to_delegate_stake: TxDescriptor<Anonymize<I931cottvong90>>;
    };
    AssetConversion: {
        /**
         * Creates an empty liquidity pool and an associated new `lp_token` asset
         * (the id of which is returned in the `Event::PoolCreated` event).
         *
         * Once a pool is created, someone may [`Pallet::add_liquidity`] to it.
         */
        create_pool: TxDescriptor<Anonymize<Ibot63dbdh2glr>>;
        /**
         * Provide liquidity into the pool of `asset1` and `asset2`.
         * NOTE: an optimal amount of asset1 and asset2 will be calculated and
         * might be different than the provided `amount1_desired`/`amount2_desired`
         * thus you should provide the min amount you're happy to provide.
         * Params `amount1_min`/`amount2_min` represent that.
         * `mint_to` will be sent the liquidity tokens that represent this share of the pool.
         *
         * NOTE: when encountering an incorrect exchange rate and non-withdrawable pool liquidity,
         * batch an atomic call with [`Pallet::add_liquidity`] and
         * [`Pallet::swap_exact_tokens_for_tokens`] or [`Pallet::swap_tokens_for_exact_tokens`]
         * calls to render the liquidity withdrawable and rectify the exchange rate.
         *
         * Once liquidity is added, someone may successfully call
         * [`Pallet::swap_exact_tokens_for_tokens`].
         */
        add_liquidity: TxDescriptor<Anonymize<I159idlqohsibn>>;
        /**
         * Allows you to remove liquidity by providing the `lp_token_burn` tokens that will be
         * burned in the process. With the usage of `amount1_min_receive`/`amount2_min_receive`
         * it's possible to control the min amount of returned tokens you're happy with.
         */
        remove_liquidity: TxDescriptor<Anonymize<Iakc63ljp5po9a>>;
        /**
         * Swap the exact amount of `asset1` into `asset2`.
         * `amount_out_min` param allows you to specify the min amount of the `asset2`
         * you're happy to receive.
         *
         * [`AssetConversionApi::quote_price_exact_tokens_for_tokens`] runtime call can be called
         * for a quote.
         */
        swap_exact_tokens_for_tokens: TxDescriptor<Anonymize<Id3g8b5i00okmf>>;
        /**
         * Swap any amount of `asset1` to get the exact amount of `asset2`.
         * `amount_in_max` param allows to specify the max amount of the `asset1`
         * you're happy to provide.
         *
         * [`AssetConversionApi::quote_price_tokens_for_exact_tokens`] runtime call can be called
         * for a quote.
         */
        swap_tokens_for_exact_tokens: TxDescriptor<Anonymize<I4te2k2l2kne4q>>;
        /**
         * Touch an existing pool to fulfill prerequisites before providing liquidity, such as
         * ensuring that the pool's accounts are in place. It is typically useful when a pool
         * creator removes the pool's accounts and does not provide a liquidity. This action may
         * involve holding assets from the caller as a deposit for creating the pool's accounts.
         *
         * The origin must be Signed.
         *
         * - `asset1`: The asset ID of an existing pool with a pair (asset1, asset2).
         * - `asset2`: The asset ID of an existing pool with a pair (asset1, asset2).
         *
         * Emits `Touched` event when successful.
         */
        touch: TxDescriptor<Anonymize<Ibot63dbdh2glr>>;
        /**
         * Like [`Pallet::create_pool`], but sets an initial per-pool swap `fee` overriding the
         * global [`Config::LPFee`].
         *
         * Requires [`Config::AdminOrigin`]. `creator` pays the pool setup fee and deposits.
         * `fee` must not exceed [`Config::MaxSwapFee`].
         *
         * Emits both [`Event::PoolCreated`] and [`Event::PoolFeeSet`] on success.
         */
        create_pool_with_fee: TxDescriptor<Anonymize<I2dgughrdjdpcj>>;
        /**
         * Set the per-pool swap `fee` for an existing pool, overriding the global
         * [`Config::LPFee`].
         *
         * Requires [`Config::AdminOrigin`]. `fee` must not exceed [`Config::MaxSwapFee`].
         *
         * Emits [`Event::PoolFeeSet`] on success.
         */
        set_pool_fee: TxDescriptor<Anonymize<Ied3h58e6qlrmv>>;
    };
    FastUnstake: {
        /**
         * Register oneself for fast-unstake.
         *
         * ## Dispatch Origin
         *
         * The dispatch origin of this call must be *signed* by whoever is permitted to call
         * unbond funds by the staking system. See [`Config::Staking`].
         *
         * ## Details
         *
         * The stash associated with the origin must have no ongoing unlocking chunks. If
         * successful, this will fully unbond and chill the stash. Then, it will enqueue the stash
         * to be checked in further blocks.
         *
         * If by the time this is called, the stash is actually eligible for fast-unstake, then
         * they are guaranteed to remain eligible, because the call will chill them as well.
         *
         * If the check works, the entire staking data is removed, i.e. the stash is fully
         * unstaked.
         *
         * If the check fails, the stash remains chilled and waiting for being unbonded as in with
         * the normal staking system, but they lose part of their unbonding chunks due to consuming
         * the chain's resources.
         *
         * ## Events
         *
         * Some events from the staking and currency system might be emitted.
         */
        register_fast_unstake: TxDescriptor<undefined>;
        /**
         * Deregister oneself from the fast-unstake.
         *
         * ## Dispatch Origin
         *
         * The dispatch origin of this call must be *signed* by whoever is permitted to call
         * unbond funds by the staking system. See [`Config::Staking`].
         *
         * ## Details
         *
         * This is useful if one is registered, they are still waiting, and they change their mind.
         *
         * Note that the associated stash is still fully unbonded and chilled as a consequence of
         * calling [`Pallet::register_fast_unstake`]. Therefore, this should probably be followed
         * by a call to `rebond` in the staking system.
         *
         * ## Events
         *
         * Some events from the staking and currency system might be emitted.
         */
        deregister: TxDescriptor<undefined>;
        /**
         * Control the operation of this pallet.
         *
         * ## Dispatch Origin
         *
         * The dispatch origin of this call must be [`Config::ControlOrigin`].
         *
         * ## Details
         *
         * Can set the number of eras to check per block, and potentially other admin work.
         *
         * ## Events
         *
         * No events are emitted from this dispatch.
         */
        control: TxDescriptor<Anonymize<I9j0ul7nh7b8jv>>;
    };
    MessageQueue: {
        /**
         * Remove a page which has no more messages remaining to be processed or is stale.
         */
        reap_page: TxDescriptor<Anonymize<Ierp7e8nj861eo>>;
        /**
         * Execute an overweight message.
         *
         * Temporary processing errors will be propagated whereas permanent errors are treated
         * as success condition.
         *
         * - `origin`: Must be `Signed`.
         * - `message_origin`: The origin from which the message to be executed arrived.
         * - `page`: The page in the queue in which the message to be executed is sitting.
         * - `index`: The index into the queue of the message to be executed.
         * - `weight_limit`: The maximum amount of weight allowed to be consumed in the execution
         * of the message.
         *
         * Benchmark complexity considerations: O(index + weight_limit).
         */
        execute_overweight: TxDescriptor<Anonymize<Ibgvds6gf6dbmm>>;
    };
    TxPause: {
        /**
         * Pause a call.
         *
         * Can only be called by [`Config::PauseOrigin`].
         * Emits an [`Event::CallPaused`] event on success.
         */
        pause: TxDescriptor<Anonymize<Iba7pefg0d11kh>>;
        /**
         * Un-pause a call.
         *
         * Can only be called by [`Config::UnpauseOrigin`].
         * Emits an [`Event::CallUnpaused`] event on success.
         */
        unpause: TxDescriptor<Anonymize<I2pjehun5ehh5i>>;
    };
    SafeMode: {
        /**
         * Enter safe-mode permissionlessly for [`Config::EnterDuration`] blocks.
         *
         * Reserves [`Config::EnterDepositAmount`] from the caller's account.
         * Emits an [`Event::Entered`] event on success.
         * Errors with [`Error::Entered`] if the safe-mode is already entered.
         * Errors with [`Error::NotConfigured`] if the deposit amount is `None`.
         */
        enter: TxDescriptor<undefined>;
        /**
         * Enter safe-mode by force for a per-origin configured number of blocks.
         *
         * Emits an [`Event::Entered`] event on success.
         * Errors with [`Error::Entered`] if the safe-mode is already entered.
         *
         * Can only be called by the [`Config::ForceEnterOrigin`] origin.
         */
        force_enter: TxDescriptor<undefined>;
        /**
         * Extend the safe-mode permissionlessly for [`Config::ExtendDuration`] blocks.
         *
         * This accumulates on top of the current remaining duration.
         * Reserves [`Config::ExtendDepositAmount`] from the caller's account.
         * Emits an [`Event::Extended`] event on success.
         * Errors with [`Error::Exited`] if the safe-mode is entered.
         * Errors with [`Error::NotConfigured`] if the deposit amount is `None`.
         *
         * This may be called by any signed origin with [`Config::ExtendDepositAmount`] free
         * currency to reserve. This call can be disabled for all origins by configuring
         * [`Config::ExtendDepositAmount`] to `None`.
         */
        extend: TxDescriptor<undefined>;
        /**
         * Extend the safe-mode by force for a per-origin configured number of blocks.
         *
         * Emits an [`Event::Extended`] event on success.
         * Errors with [`Error::Exited`] if the safe-mode is inactive.
         *
         * Can only be called by the [`Config::ForceExtendOrigin`] origin.
         */
        force_extend: TxDescriptor<undefined>;
        /**
         * Exit safe-mode by force.
         *
         * Emits an [`Event::Exited`] with [`ExitReason::Force`] event on success.
         * Errors with [`Error::Exited`] if the safe-mode is inactive.
         *
         * Note: `safe-mode` will be automatically deactivated by [`Pallet::on_initialize`] hook
         * after the block height is greater than the [`EnteredUntil`] storage item.
         * Emits an [`Event::Exited`] with [`ExitReason::Timeout`] event when deactivated in the
         * hook.
         */
        force_exit: TxDescriptor<undefined>;
        /**
         * Slash a deposit for an account that entered or extended safe-mode at a given
         * historical block.
         *
         * This can only be called while safe-mode is entered.
         *
         * Emits a [`Event::DepositSlashed`] event on success.
         * Errors with [`Error::Entered`] if safe-mode is entered.
         *
         * Can only be called by the [`Config::ForceDepositOrigin`] origin.
         */
        force_slash_deposit: TxDescriptor<Anonymize<I1ssp78ejl639m>>;
        /**
         * Permissionlessly release a deposit for an account that entered safe-mode at a
         * given historical block.
         *
         * The call can be completely disabled by setting [`Config::ReleaseDelay`] to `None`.
         * This cannot be called while safe-mode is entered and not until
         * [`Config::ReleaseDelay`] blocks have passed since safe-mode was entered.
         *
         * Emits a [`Event::DepositReleased`] event on success.
         * Errors with [`Error::Entered`] if the safe-mode is entered.
         * Errors with [`Error::CannotReleaseYet`] if [`Config::ReleaseDelay`] block have not
         * passed since safe-mode was entered. Errors with [`Error::NoDeposit`] if the payee has no
         * reserved currency at the block specified.
         */
        release_deposit: TxDescriptor<Anonymize<I1ssp78ejl639m>>;
        /**
         * Force to release a deposit for an account that entered safe-mode at a given
         * historical block.
         *
         * This can be called while safe-mode is still entered.
         *
         * Emits a [`Event::DepositReleased`] event on success.
         * Errors with [`Error::Entered`] if safe-mode is entered.
         * Errors with [`Error::NoDeposit`] if the payee has no reserved currency at the
         * specified block.
         *
         * Can only be called by the [`Config::ForceDepositOrigin`] origin.
         */
        force_release_deposit: TxDescriptor<Anonymize<I1ssp78ejl639m>>;
    };
    MultiBlockMigrations: {
        /**
         * Allows root to set a cursor to forcefully start, stop or forward the migration process.
         *
         * Should normally not be needed and is only in place as emergency measure. Note that
         * restarting the migration process in this manner will not call the
         * [`MigrationStatusHandler::started`] hook or emit an `UpgradeStarted` event.
         */
        force_set_cursor: TxDescriptor<Anonymize<Ibou4u1engb441>>;
        /**
         * Allows root to set an active cursor to forcefully start/forward the migration process.
         *
         * This is an edge-case version of [`Self::force_set_cursor`] that allows to set the
         * `started_at` value to the next block number. Otherwise this would not be possible, since
         * `force_set_cursor` takes an absolute block number. Setting `started_at` to `None`
         * indicates that the current block number plus one should be used.
         */
        force_set_active_cursor: TxDescriptor<Anonymize<Id6nbvqoqdj4o2>>;
        /**
         * Forces the onboarding of the migrations.
         *
         * This process happens automatically on a runtime upgrade. It is in place as an emergency
         * measurement. The cursor needs to be `None` for this to succeed.
         */
        force_onboard_mbms: TxDescriptor<undefined>;
        /**
         * Clears the `Historic` set.
         *
         * `map_cursor` must be set to the last value that was returned by the
         * `HistoricCleared` event. The first time `None` can be used. `limit` must be chosen in a
         * way that will result in a sensible weight.
         */
        clear_historic: TxDescriptor<Anonymize<I95iqep3b8snn9>>;
    };
    Broker: {
        /**
         * Configure the pallet.
         *
         * - `origin`: Must be Root or pass `AdminOrigin`.
         * - `config`: The configuration for this pallet.
         */
        configure: TxDescriptor<Anonymize<I4v4jc8ak5c8j7>>;
        /**
         * Reserve a core for a workload.
         *
         * The workload will be given a reservation, but two sale period boundaries must pass
         * before the core is actually assigned.
         *
         * - `origin`: Must be Root or pass `AdminOrigin`.
         * - `workload`: The workload which should be permanently placed on a core.
         */
        reserve: TxDescriptor<Anonymize<Ieifvmse8ekofd>>;
        /**
         * Cancel a reservation for a workload.
         *
         * - `origin`: Must be Root or pass `AdminOrigin`.
         * - `item_index`: The index of the reservation. Usually this will also be the index of the
         * core on which the reservation has been scheduled. However, it is possible that if
         * other cores are reserved or unreserved in the same sale rotation that they won't
         * correspond, so it's better to look up the core properly in the `Reservations` storage.
         */
        unreserve: TxDescriptor<Anonymize<Iepja8rcbuaao2>>;
        /**
         * Reserve a core for a single task workload for a limited period.
         *
         * In the interlude and sale period where Bulk Coretime is sold for the period immediately
         * after `until`, then the same workload may be renewed.
         *
         * - `origin`: Must be Root or pass `AdminOrigin`.
         * - `task`: The workload which should be placed on a core.
         * - `until`: The timeslice now earlier than which `task` should be placed as a workload on
         * a core.
         */
        set_lease: TxDescriptor<Anonymize<I10gda06ia6n74>>;
        /**
         * Begin the Bulk Coretime sales rotation.
         *
         * - `origin`: Must be Root or pass `AdminOrigin`.
         * - `end_price`: The price after the leadin period of Bulk Coretime in the first sale.
         * - `extra_cores`: Number of extra cores that should be requested on top of the cores
         * required for `Reservations` and `Leases`.
         *
         * This will call [`Self::request_core_count`] internally to set the correct core count on
         * the relay chain.
         */
        start_sales: TxDescriptor<Anonymize<I6bqnueuk5semj>>;
        /**
         * Purchase Bulk Coretime in the ongoing Sale.
         *
         * - `origin`: Must be a Signed origin with at least enough funds to pay the current price
         * of Bulk Coretime.
         * - `price_limit`: An amount no more than which should be paid.
         */
        purchase: TxDescriptor<Anonymize<I268qbbcqfpqi0>>;
        /**
         * Renew Bulk Coretime in the ongoing Sale or its prior Interlude Period.
         *
         * - `origin`: Must be a Signed origin with at least enough funds to pay the renewal price
         * of the core.
         * - `core`: The core which should be renewed.
         */
        renew: TxDescriptor<Anonymize<Iaiqv5prlisjkg>>;
        /**
         * Transfer a Bulk Coretime Region to a new owner.
         *
         * - `origin`: Must be a Signed origin of the account which owns the Region `region_id`.
         * - `region_id`: The Region whose ownership should change.
         * - `new_owner`: The new owner for the Region.
         */
        transfer: TxDescriptor<Anonymize<Ia3ebg5qshpkmr>>;
        /**
         * Split a Bulk Coretime Region into two non-overlapping Regions at a particular time into
         * the region.
         *
         * - `origin`: Must be a Signed origin of the account which owns the Region `region_id`.
         * - `region_id`: The Region which should be partitioned into two non-overlapping Regions.
         * - `pivot`: The offset in time into the Region at which to make the split.
         */
        partition: TxDescriptor<Anonymize<Iagnp6gsiemekd>>;
        /**
         * Split a Bulk Coretime Region into two wholly-overlapping Regions with complementary
         * interlace masks which together make up the original Region's interlace mask.
         *
         * - `origin`: Must be a Signed origin of the account which owns the Region `region_id`.
         * - `region_id`: The Region which should become two interlaced Regions of incomplete
         * regularity.
         * - `pivot`: The interlace mask of one of the two new regions (the other is its partial
         * complement).
         */
        interlace: TxDescriptor<Anonymize<I2uc90glvkisre>>;
        /**
         * Assign a Bulk Coretime Region to a task.
         *
         * - `origin`: Must be a Signed origin of the account which owns the Region `region_id`.
         * - `region_id`: The Region which should be assigned to the task.
         * - `task`: The task to assign.
         * - `finality`: Indication of whether this assignment is final (in which case it may be
         * eligible for renewal) or provisional (in which case it may be manipulated and/or
         * reassigned at a later stage).
         */
        assign: TxDescriptor<Anonymize<I7tcaqpipfe64i>>;
        /**
         * Place a Bulk Coretime Region into the Instantaneous Coretime Pool.
         *
         * - `origin`: Must be a Signed origin of the account which owns the Region `region_id`.
         * - `region_id`: The Region which should be assigned to the Pool.
         * - `payee`: The account which is able to collect any revenue due for the usage of this
         * Coretime.
         */
        pool: TxDescriptor<Anonymize<I6eqlfpqd4sp3a>>;
        /**
         * Claim the revenue owed from inclusion in the Instantaneous Coretime Pool.
         *
         * - `origin`: Must be a Signed origin.
         * - `region_id`: The Region which was assigned to the Pool.
         * - `max_timeslices`: The maximum number of timeslices which should be processed. This
         * must be greater than 0. This may affect the weight of the call but should be ideally
         * made equivalent to the length of the Region `region_id`. If less, further dispatches
         * will be required with the same `region_id` to claim revenue for the remainder.
         */
        claim_revenue: TxDescriptor<Anonymize<Ib2n01qni7h5uk>>;
        /**
         * Purchase credit for use in the Instantaneous Coretime Pool.
         *
         * - `origin`: Must be a Signed origin able to pay at least `amount`.
         * - `amount`: The amount of credit to purchase.
         * - `beneficiary`: The account on the Relay-chain which controls the credit (generally
         * this will be the collator's hot wallet).
         */
        purchase_credit: TxDescriptor<Anonymize<Idscf6boak49q1>>;
        /**
         * Drop an expired Region from the chain.
         *
         * - `origin`: Can be any kind of origin.
         * - `region_id`: The Region which has expired.
         */
        drop_region: TxDescriptor<Anonymize<I4s60s3v5pfj6u>>;
        /**
         * Drop an expired Instantaneous Pool Contribution record from the chain.
         *
         * - `origin`: Can be any kind of origin.
         * - `region_id`: The Region identifying the Pool Contribution which has expired.
         */
        drop_contribution: TxDescriptor<Anonymize<I4s60s3v5pfj6u>>;
        /**
         * Drop an expired Instantaneous Pool History record from the chain.
         *
         * - `origin`: Can be any kind of origin.
         * - `region_id`: The time of the Pool History record which has expired.
         */
        drop_history: TxDescriptor<Anonymize<Ibtsa3docbr9el>>;
        /**
         * Drop an expired Allowed Renewal record from the chain.
         *
         * - `origin`: Can be any kind of origin.
         * - `core`: The core to which the expired renewal refers.
         * - `when`: The timeslice to which the expired renewal refers. This must have passed.
         */
        drop_renewal: TxDescriptor<Anonymize<I3blejcb10m5c9>>;
        /**
         * Request a change to the number of cores available for scheduling work.
         *
         * - `origin`: Must be Root or pass `AdminOrigin`.
         * - `core_count`: The desired number of cores to be made available.
         */
        request_core_count: TxDescriptor<Anonymize<I629ak383ovl28>>;
        /**
        
         */
        notify_core_count: TxDescriptor<Anonymize<I629ak383ovl28>>;
        /**
        
         */
        notify_revenue: TxDescriptor<Anonymize<I5cuv5a5cclsfd>>;
        /**
         * Extrinsic for enabling auto renewal.
         *
         * Callable by the sovereign account of the task on the specified core. This account
         * will be charged at the start of every bulk period for renewing core time.
         *
         * - `origin`: Must be the sovereign account of the task
         * - `core`: The core to which the task to be renewed is currently assigned.
         * - `task`: The task for which we want to enable auto renewal.
         * - `workload_end_hint`: should be used when enabling auto-renewal for a core that is not
         * expiring in the upcoming bulk period (e.g., due to holding a lease) since it would be
         * inefficient to look up when the core expires to schedule the next renewal.
         */
        enable_auto_renew: TxDescriptor<Anonymize<Ie3qk84fi8j51k>>;
        /**
         * Extrinsic for disabling auto renewal.
         *
         * Callable by the sovereign account of the task on the specified core.
         *
         * - `origin`: Must be the sovereign account of the task.
         * - `core`: The core for which we want to disable auto renewal.
         * - `task`: The task for which we want to disable auto renewal.
         */
        disable_auto_renew: TxDescriptor<Anonymize<I6td68h84ru5u7>>;
        /**
         * Reserve a core for a workload immediately.
         *
         * - `origin`: Must be Root or pass `AdminOrigin`.
         * - `workload`: The workload which should be permanently placed on a core starting
         * immediately.
         * - `core`: The core to which the assignment should be made until the reservation takes
         * effect. It is left to the caller to either add this new core or reassign any other
         * tasks to this existing core.
         *
         * This reserves the workload and then injects the workload into the Workplan for the next
         * two sale periods. This overwrites any existing assignments for this core at the start of
         * the next sale period.
         */
        force_reserve: TxDescriptor<Anonymize<Ickqtr6vqgluk1>>;
        /**
         * Remove a lease.
         *
         * - `origin`: Must be Root or pass `AdminOrigin`.
         * - `task`: The task id of the lease which should be removed.
         */
        remove_lease: TxDescriptor<Anonymize<Ihqcf8k5b8c95>>;
        /**
         * Remove an assignment from the Workplan.
         *
         * - `origin`: Must be Root or pass `AdminOrigin`.
         * - `region_id`: The Region to be removed from the workplan.
         */
        remove_assignment: TxDescriptor<Anonymize<I4s60s3v5pfj6u>>;
        /**
         * Forcefully remove a potential renewal record from chain.
         *
         * Note that only the specified potential renewal will be removed while any related auto
         * renewals will stay intact and will fail.
         *
         * - `origin`: Must be Root or pass `AdminOrigin`.
         * - `core`: Core which the target potential renewal record refers to.
         * - `when`: Timeslice which the target potential renewal record refers to.
         */
        remove_potential_renewal: TxDescriptor<Anonymize<I3blejcb10m5c9>>;
        /**
         * Transfer a Bulk Coretime Region to a new owner, ignoring the previous owner.
         *
         * This can also be used to recover regions that have been "burned" (e.g., from an
         * XCM reserve transfer).
         *
         * - `origin`: Must be Root or pass `AdminOrigin`.
         * - `region_id`: The Region whose ownership should change.
         * - `new_owner`: The new owner for the Region.
         */
        force_transfer: TxDescriptor<Anonymize<Ia3ebg5qshpkmr>>;
        /**
        
         */
        swap_leases: TxDescriptor<Anonymize<Idehabrqi23sc0>>;
    };
    Mixnet: {
        /**
         * Register a mixnode for the following session.
         */
        register: TxDescriptor<Anonymize<I2knvr4mp5k6t3>>;
    };
    Parameters: {
        /**
         * Set the value of a parameter.
         *
         * The dispatch origin of this call must be `AdminOrigin` for the given `key`. Values be
         * deleted by setting them to `None`.
         */
        set_parameter: TxDescriptor<Anonymize<I8jl7pfcvfu3kv>>;
    };
    AssetConversionMigration: {
        /**
         * Migrates an existing pool to a new account ID derivation method for a given asset pair.
         * If the migration is successful, transaction fees are refunded to the caller.
         *
         * Must be signed.
         */
        migrate_to_new_account: TxDescriptor<Anonymize<Ibot63dbdh2glr>>;
    };
    Revive: {
        /**
         * A raw EVM transaction, typically dispatched by an Ethereum JSON-RPC server.
         *
         * # Parameters
         *
         * * `payload`: The encoded [`crate::evm::TransactionSigned`].
         *
         * # Note
         *
         * This call cannot be dispatched directly; attempting to do so will result in a failed
         * transaction. It serves as a wrapper for an Ethereum transaction. When submitted, the
         * runtime converts it into a [`sp_runtime::generic::CheckedExtrinsic`] by recovering the
         * signer and validating the transaction.
         */
        eth_transact: TxDescriptor<Anonymize<Ida37oe44osb06>>;
        /**
         * Makes a call to an account, optionally transferring some balance.
         *
         * # Parameters
         *
         * * `dest`: Address of the contract to call.
         * * `value`: The balance to transfer from the `origin` to `dest`.
         * * `weight_limit`: The weight limit enforced when executing the constructor.
         * * `storage_deposit_limit`: The maximum amount of balance that can be charged from the
         * caller to pay for the storage consumed.
         * * `data`: The input data to pass to the contract.
         *
         * * If the account is a smart-contract account, the associated code will be
         * executed and any value will be transferred.
         * * If the account is a regular account, any value will be transferred.
         * * If no account exists and the call value is not less than `existential_deposit`,
         * a regular account will be created and any value will be transferred.
         */
        call: TxDescriptor<Anonymize<I6v02o6j4snahe>>;
        /**
         * Instantiates a contract from a previously deployed vm binary.
         *
         * This function is identical to [`Self::instantiate_with_code`] but without the
         * code deployment step. Instead, the `code_hash` of an on-chain deployed vm binary
         * must be supplied.
         */
        instantiate: TxDescriptor<Anonymize<I27569neuh5t1o>>;
        /**
         * Instantiates a new contract from the supplied `code` optionally transferring
         * some balance.
         *
         * This dispatchable has the same effect as calling [`Self::upload_code`] +
         * [`Self::instantiate`]. Bundling them together provides efficiency gains. Please
         * also check the documentation of [`Self::upload_code`].
         *
         * # Parameters
         *
         * * `value`: The balance to transfer from the `origin` to the newly created contract.
         * * `weight_limit`: The weight limit enforced when executing the constructor.
         * * `storage_deposit_limit`: The maximum amount of balance that can be charged/reserved
         * from the caller to pay for the storage consumed.
         * * `code`: The contract code to deploy in raw bytes.
         * * `data`: The input data to pass to the contract constructor.
         * * `salt`: Used for the address derivation. If `Some` is supplied then `CREATE2`
         * semantics are used. If `None` then `CRATE1` is used.
         *
         *
         * Instantiation is executed as follows:
         *
         * - The supplied `code` is deployed, and a `code_hash` is created for that code.
         * - If the `code_hash` already exists on the chain the underlying `code` will be shared.
         * - The destination address is computed based on the sender, code_hash and the salt.
         * - The smart-contract account is created at the computed address.
         * - The `value` is transferred to the new account.
         * - The `deploy` function is executed in the context of the newly-created account.
         */
        instantiate_with_code: TxDescriptor<Anonymize<Id92o6smntb9m5>>;
        /**
         * Same as [`Self::instantiate_with_code`], but intended to be dispatched **only**
         * by an EVM transaction through the EVM compatibility layer.
         *
         * # Parameters
         *
         * * `value`: The balance to transfer from the `origin` to the newly created contract.
         * * `weight_limit`: The gas limit used to derive the transaction weight for transaction
         * payment
         * * `eth_gas_limit`: The Ethereum gas limit governing the resource usage of the execution
         * * `code`: The contract code to deploy in raw bytes.
         * * `data`: The input data to pass to the contract constructor.
         * * `transaction_encoded`: The RLP encoding of the signed Ethereum transaction,
         * represented as [crate::evm::TransactionSigned], provided by the Ethereum wallet. This
         * is used for building the Ethereum transaction root.
         * * effective_gas_price: the price of a unit of gas
         * * encoded len: the byte code size of the `eth_transact` extrinsic
         *
         * Calling this dispatchable ensures that the origin's nonce is bumped only once,
         * via the `CheckNonce` transaction extension. In contrast, [`Self::instantiate_with_code`]
         * also bumps the nonce after contract instantiation, since it may be invoked multiple
         * times within a batch call transaction.
         */
        eth_instantiate_with_code: TxDescriptor<Anonymize<I5nmb2hfkgk9ol>>;
        /**
         * Same as [`Self::call`], but intended to be dispatched **only**
         * by an EVM transaction through the EVM compatibility layer.
         *
         * # Parameters
         *
         * * `dest`: The Ethereum address of the account to be called
         * * `value`: The balance to transfer from the `origin` to the newly created contract.
         * * `weight_limit`: The gas limit used to derive the transaction weight for transaction
         * payment
         * * `eth_gas_limit`: The Ethereum gas limit governing the resource usage of the execution
         * * `data`: The input data to pass to the contract constructor.
         * * `transaction_encoded`: The RLP encoding of the signed Ethereum transaction,
         * represented as [crate::evm::TransactionSigned], provided by the Ethereum wallet. This
         * is used for building the Ethereum transaction root.
         * * effective_gas_price: the price of a unit of gas
         * * encoded len: the byte code size of the `eth_transact` extrinsic
         */
        eth_call: TxDescriptor<Anonymize<Iav55bcqlrqn51>>;
        /**
         * Executes a Substrate runtime call from an Ethereum transaction.
         *
         * This dispatchable is intended to be called **only** through the EVM compatibility
         * layer. The provided call will be dispatched using `RawOrigin::Signed`.
         *
         * # Parameters
         *
         * * `origin`: Must be an [`Origin::EthTransaction`] origin.
         * * `call`: The Substrate runtime call to execute.
         * * `transaction_encoded`: The RLP encoding of the Ethereum transaction,
         */
        eth_substrate_call: TxDescriptor<Anonymize<Iqrtlsfd2lcbm>>;
        /**
         * Upload new `code` without instantiating a contract from it.
         *
         * If the code does not already exist a deposit is reserved from the caller
         * The size of the reserve depends on the size of the supplied `code`.
         *
         * # Note
         *
         * Anyone can instantiate a contract from any uploaded code and thus prevent its removal.
         * To avoid this situation a constructor could employ access control so that it can
         * only be instantiated by permissioned entities. The same is true when uploading
         * through [`Self::instantiate_with_code`].
         *
         * If the refcount of the code reaches zero after terminating the last contract that
         * references this code, the code will be removed automatically.
         */
        upload_code: TxDescriptor<Anonymize<I10ra4g1rl6k2f>>;
        /**
         * Remove the code stored under `code_hash` and refund the deposit to its owner.
         *
         * A code can only be removed by its original uploader (its owner) and only if it is
         * not used by any contract.
         */
        remove_code: TxDescriptor<Anonymize<Ib51vk42m1po4n>>;
        /**
         * Privileged function that changes the code of an existing contract.
         *
         * This takes care of updating refcounts and all other necessary operations. Returns
         * an error if either the `code_hash` or `dest` do not exist.
         *
         * # Note
         *
         * This does **not** change the address of the contract in question. This means
         * that the contract address is no longer derived from its code hash after calling
         * this dispatchable.
         */
        set_code: TxDescriptor<Anonymize<I1uihehkdsggvp>>;
        /**
         * Register the callers account id so that it can be used in contract interactions.
         *
         * This will error if the origin is already mapped or is a eth native `Address20`. It will
         * take a deposit that can be released by calling [`Self::unmap_account`].
         *
         * Noop when [`Config::AutoMap`] is enabled, as accounts are automatically mapped
         * on creation via [`AutoMapper`].
         */
        map_account: TxDescriptor<undefined>;
        /**
         * Map many accounts and make the TX free if at least 90% were unmapped or held deposits.
         */
        batch_map_accounts: TxDescriptor<Anonymize<I9gel4bv68gacj>>;
        /**
         * Unregister the callers account id in order to free the deposit.
         *
         * There is no reason to ever call this function other than freeing up the deposit.
         * This is only useful when the account should no longer be used.
         *
         * Disabled when [`Config::AutoMap`] is enabled, as accounts are automatically unmapped
         * on kill via [`AutoMapper`].
         */
        unmap_account: TxDescriptor<undefined>;
        /**
         * Dispatch an `call` with the origin set to the callers fallback address.
         *
         * Every `AccountId32` can control its corresponding fallback account. The fallback account
         * is the `AccountId20` with the last 12 bytes set to `0xEE`. This is essentially a
         * recovery function in case an `AccountId20` was used without creating a mapping first.
         */
        dispatch_as_fallback_account: TxDescriptor<Anonymize<Idcpp47q096b5p>>;
    };
    Oracle: {
        /**
         * Feeds external data values into the oracle system.
         *
         * ## Dispatch Origin
         *
         * The dispatch origin of this call must be a signed account that is either:
         * - A member of the oracle operators set (managed by [`SortedMembers`])
         * - The root origin
         *
         * ## Details
         *
         * This function allows authorized oracle operators to submit timestamped key-value pairs
         * into the oracle system. Each submitted value is immediately timestamped with the current
         * block time and stored in the [`RawValues`] storage. The system then attempts to
         * aggregate all raw values for each key using the configured [`CombineData`] trait
         * implementation, updating the final [`Values`] storage with the aggregated result.
         *
         * Only one submission per oracle operator per block is allowed to prevent spam and ensure
         * fair participation. The function also triggers the [`OnNewData`] hook for each submitted
         * value, allowing other pallets to react to new oracle data.
         *
         * ## Errors
         *
         * - [`Error::NoPermission`]: The sender is not authorized to feed data
         * - [`Error::AlreadyFeeded`]: The sender has already fed data in the current block
         * - [`Error::ExceedsMaxHasDispatchedSize`]: Too many operators have fed data in this block
         *
         * ## Events
         *
         * - [`Event::NewFeedData`]: Emitted when data is successfully fed into the oracle
         */
        feed_values: TxDescriptor<Anonymize<I4758mvfui73ro>>;
    };
    MetaTx: {
        /**
         * Dispatch a given meta transaction.
         *
         * - `_origin`: Can be any kind of origin.
         * - `meta_tx`: Meta Transaction with a target call to be dispatched.
         * - `meta_tx_encoded_len`: The size of the encoded meta transaction in bytes.
         */
        dispatch: TxDescriptor<Anonymize<I6gq6p3sibtpsu>>;
    };
    MultiAssetBounties: {
        /**
         * Fund a new bounty with a proposed curator, initiating the payment from the
         * funding source to the bounty account/location.
         *
         * ## Dispatch Origin
         *
         * Must be [`Config::SpendOrigin`] with the `Success` value being at least
         * the bounty value converted to native balance using [`Config::BalanceConverter`].
         * The converted native amount is validated against the maximum spendable amount
         * returned by [`Config::SpendOrigin`].
         *
         * ## Details
         *
         * - The `SpendOrigin` must have sufficient permissions to fund the bounty.
         * - The bounty `value` (in asset balance) is converted to native balance for validation.
         * - In case of a funding failure, the bounty status must be updated with the
         * `check_status` call before retrying with `retry_payment` call.
         *
         * ### Parameters
         * - `asset_kind`: An indicator of the specific asset class to be funded.
         * - `value`: The total payment amount of this bounty.
         * - `curator`: Address of bounty curator.
         * - `metadata`: The hash of an on-chain stored preimage with bounty metadata.
         *
         * ## Events
         *
         * Emits [`Event::BountyCreated`] and [`Event::Paid`] if successful.
         */
        fund_bounty: TxDescriptor<Anonymize<I71dqiv5kjda2b>>;
        /**
         * Fund a new child-bounty with a proposed curator, initiating the payment from the parent
         * bounty to the child-bounty account/location.
         *
         * ## Dispatch Origin
         *
         * Must be signed by the parent curator.
         *
         * ## Details
         *
         * - If `curator` is not provided, the child-bounty will default to using the parent
         * curator, allowing the parent curator to immediately call `check_status` and
         * `award_bounty` to payout the child-bounty.
         * - In case of a funding failure, the child-/bounty status must be updated with the
         * `check_status` call before retrying with `retry_payment` call.
         *
         * ### Parameters
         * - `parent_bounty_id`: Index of parent bounty for which child-bounty is being added.
         * - `value`: The payment amount of this child-bounty.
         * - `metadata`: The hash of an on-chain stored preimage with child-bounty metadata.
         * - `curator`: Address of child-bounty curator.
         *
         * ## Events
         *
         * Emits [`Event::ChildBountyCreated`] and [`Event::Paid`] if successful.
         */
        fund_child_bounty: TxDescriptor<Anonymize<I5tr07eeku900u>>;
        /**
         * Propose a new curator for a child-/bounty after the previous was unassigned.
         *
         * ## Dispatch Origin
         *
         * Must be signed by `T::SpendOrigin` for a bounty, or by the parent bounty curator
         * for a child-bounty.
         *
         * ## Details
         *
         * - The child-/bounty must be in the `CuratorUnassigned` state.
         * - For a bounty, the `SpendOrigin` must have sufficient permissions to propose the
         * curator.
         *
         * ### Parameters
         * - `parent_bounty_id`: Index of bounty.
         * - `child_bounty_id`: Index of child-bounty.
         * - `curator`: Account to be proposed as the curator.
         *
         * ## Events
         *
         * Emits [`Event::CuratorProposed`] if successful.
         */
        propose_curator: TxDescriptor<Anonymize<I5653fv7gatldu>>;
        /**
         * Accept the curator role for a child-/bounty.
         *
         * ## Dispatch Origin
         *
         * Must be signed by the proposed curator.
         *
         * ## Details
         *
         * - The child-/bounty must be in the `Funded` state.
         * - The curator must accept the role by calling this function.
         * - A deposit will be reserved from the curator and refunded upon successful payout.
         *
         * ### Parameters
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child-bounty.
         *
         * ## Events
         *
         * Emits [`Event::BountyBecameActive`] if successful.
         */
        accept_curator: TxDescriptor<Anonymize<I9bg8aubpi9e76>>;
        /**
         * Unassign curator from a child-/bounty.
         *
         * ## Dispatch Origin
         *
         * This function can only be called by the `RejectOrigin` or the child-/bounty curator.
         *
         * ## Details
         *
         * - If this function is called by the `RejectOrigin`, or by the parent curator in the case
         * of a child bounty, we assume that the curator is malicious or inactive. As a result,
         * we will slash the curator when possible.
         * - If the origin is the child-/bounty curator, we take this as a sign they are unable to
         * do their job and they willingly give up. We could slash them, but for now we allow
         * them to recover their deposit and exit without issue. (We may want to change this if
         * it is abused).
         * - If successful, the child-/bounty status is updated to `CuratorUnassigned`. To
         * reactivate the bounty, a new curator must be proposed and must accept the role.
         *
         * ### Parameters
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child-bounty.
         *
         * ## Events
         *
         * Emits [`Event::CuratorUnassigned`] if successful.
         */
        unassign_curator: TxDescriptor<Anonymize<I9bg8aubpi9e76>>;
        /**
         * Awards the child-/bounty to a beneficiary account/location,
         * initiating the payout payments to both the beneficiary and the curator.
         *
         * ## Dispatch Origin
         *
         * This function can only be called by the `RejectOrigin` or the child-/bounty curator.
         *
         * ## Details
         *
         * - The child-/bounty must be in the `Active` state.
         * - if awarding a parent bounty it must not have active or funded child bounties.
         * - Initiates payout payment from the child-/bounty to the beneficiary account/location.
         * - If successful the child-/bounty status is updated to `PayoutAttempted`.
         * - In case of a payout failure, the child-/bounty status must be updated with
         * `check_status` call before retrying with `retry_payment` call.
         *
         * ### Parameters
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child-bounty.
         * - `beneficiary`: Account/location to be awarded the child-/bounty.
         *
         * ## Events
         *
         * Emits [`Event::BountyAwarded`] and [`Event::Paid`] if successful.
         */
        award_bounty: TxDescriptor<Anonymize<I4hq1n8ejhmk2j>>;
        /**
         * Cancel an active child-/bounty. A payment to send all the funds to the funding source is
         * initialized.
         *
         * ## Dispatch Origin
         *
         * This function can only be called by the `RejectOrigin` or the parent bounty curator.
         *
         * ## Details
         *
         * - If the child-/bounty is in the `Funded` state, a refund payment is initiated.
         * - If the child-/bounty is in the `Active` state, a refund payment is initiated and the
         * child-/bounty status is updated with the curator account/location.
         * - If the child-/bounty is in the funding or payout phase, it cannot be canceled.
         * - In case of a refund failure, the child-/bounty status must be updated with the
         * `check_status` call before retrying with `retry_payment` call.
         *
         * ### Parameters
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child-bounty.
         *
         * ## Events
         *
         * Emits [`Event::BountyCanceled`] and [`Event::Paid`] if successful.
         */
        close_bounty: TxDescriptor<Anonymize<I9bg8aubpi9e76>>;
        /**
         * Check and update the payment status of a child-/bounty.
         *
         * ## Dispatch Origin
         *
         * Must be signed.
         *
         * ## Details
         *
         * - If the child-/bounty status is `FundingAttempted`, it checks if the funding payment
         * has succeeded. If successful, the bounty status becomes `Funded`.
         * - If the child-/bounty status is `RefundAttempted`, it checks if the refund payment has
         * succeeded. If successful, the child-/bounty is removed from storage.
         * - If the child-/bounty status is `PayoutAttempted`, it checks if the payout payment has
         * succeeded. If successful, the child-/bounty is removed from storage.
         *
         * ### Parameters
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child-bounty.
         *
         * ## Events
         *
         * Emits [`Event::BountyBecameActive`] if the child/bounty status transitions to `Active`.
         * Emits [`Event::BountyRefundProcessed`] if the refund payment has succeed.
         * Emits [`Event::BountyPayoutProcessed`] if the payout payment has succeed.
         * Emits [`Event::PaymentFailed`] if the funding, refund our payment payment has failed.
         */
        check_status: TxDescriptor<Anonymize<I9bg8aubpi9e76>>;
        /**
         * Retry the funding, refund or payout payments.
         *
         * ## Dispatch Origin
         *
         * Must be signed.
         *
         * ## Details
         *
         * - If the child-/bounty status is `FundingAttempted`, it retries the funding payment from
         * funding source the child-/bounty account/location.
         * - If the child-/bounty status is `RefundAttempted`, it retries the refund payment from
         * the child-/bounty account/location to the funding source.
         * - If the child-/bounty status is `PayoutAttempted`, it retries the payout payment from
         * the child-/bounty account/location to the beneficiary account/location.
         *
         * ### Parameters
         * - `parent_bounty_id`: Index of parent bounty.
         * - `child_bounty_id`: Index of child-bounty.
         *
         * ## Events
         *
         * Emits [`Event::Paid`] if the funding, refund or payout payment has initiated.
         */
        retry_payment: TxDescriptor<Anonymize<I9bg8aubpi9e76>>;
        /**
         * Increase the value of an active bounty by `amount`.
         *
         * ## Dispatch Origin
         *
         * Must be signed by the bounty curator.
         *
         * ## Details
         *
         * - The bounty must be in the `Active` state.
         * - Raises the recorded `value` by `amount`. This is used to register funds that were
         * transferred into the bounty account out-of-band (e.g. recurring external top-ups), so
         * they become available to award or to allocate to child bounties. It must be greater
         * than 0.
         * - The curator deposit is re-evaluated for the new value and any additional deposit is
         * collected from the curator.
         * - The value can only be increased, never decreased, so the invariant that the sum of
         * child-bounty values never exceeds the parent value is preserved.
         * - This call does **not** check that the bounty account holds `new_value`; it only
         * updates the recorded value. Payouts stay bounded by the account's real balance at
         * settlement, so increasing the value beyond the available funds simply makes a later
         * payout fail — no funds are moved by this call.
         * - Only a parent bounty's value can be increased via this call.
         *
         * ### Parameters
         * - `parent_bounty_id`: Index of the bounty whose value is increased.
         * - `amount`: The amount to add to the bounty value.
         *
         * ## Events
         *
         * Emits [`Event::BountyValueIncreased`] if successful.
         */
        increase_value: TxDescriptor<Anonymize<I8g22bn83j942k>>;
    };
    RegistrarPara: {
        /**
         * Reserve the next free para id for the caller.
         *
         * Takes [`Config::ReservationConsideration`]. The caller becomes the manager of the new
         * id and is the only account that may [`Pallet::register`] against it.
         */
        reserve: TxDescriptor<undefined>;
        /**
         * Ask the relay chain to register head data and validation code for a reserved para id.
         *
         * The validation code itself stays here: only `code_hash` and `code_len` are sent. The
         * caller uploads the blob to the relay chain separately, which accepts it only if it
         * hashes to `code_hash` and is exactly `code_len` bytes long.
         *
         * ## Costs
         *
         * Takes [`Config::RegistrationConsideration`] for the head data and the *declared* code
         * length, on top of the para id reservation. It is returned if the relay chain rejects
         * the registration or if the caller later abandons it.
         */
        register: TxDescriptor<Anonymize<Ibatn98n08e7sr>>;
        /**
         * Give up on a registration the relay chain never reported on.
         *
         * Callable from [`Config::PendingDeadline`] blocks after the request. Nothing on the
         * relay chain abandons a registration on its own, so this is what ends one whose code
         * never turned up, and the manager pays for the round trip rather than every relay-chain
         * block paying for a sweep.
         *
         * The deposit is not released here: the relay chain is asked to drop the authorization
         * first, and [`Pallet::receive`] releases the deposit when it confirms. Waiting for that
         * answer is the point. A registration that did go through, with a verdict that got lost on
         * the way here, must not have its deposit refunded, and only the relay chain knows
         * which of the two happened.
         *
         * The para id itself stays reserved either way, so the manager can simply try again.
         */
        cancel_registration: TxDescriptor<Anonymize<I37r4bdai8o9mp>>;
        /**
         * Accept a report from the relay chain's registrar pallet.
         *
         * Not callable by users: the origin must be the relay chain.
         */
        receive: TxDescriptor<Anonymize<I6k09ktco8uiuf>>;
    };
    RegistrarRelay: {
        /**
         * Accept a control-plane message from the parachain's registrar pallet and authorize the
         * validation code that will follow.
         *
         * Only callable by a trusted XCM origin (e.g. the Coretime chain), never by users.
         *
         * A request this pallet will not act on is *not* an extrinsic failure. Failing would roll
         * back the rejection report along with everything else, and the parachain would sit on a
         * held deposit waiting for news that never comes. So a rejection is applied, reported, and
         * returns `Ok`.
         */
        authorize_code: TxDescriptor<Anonymize<I3bmm0aglg28l9>>;
        /**
         * Upload the validation code for a pending authorization, onboarding the para.
         *
         * Needs no signature and pays no fee. Anybody may submit: the pending entry already fixes
         * the exact bytes that will be accepted, and the manager has already paid for them on the
         * parachain.
         */
        apply_authorized_code: TxDescriptor<Anonymize<Ic56ti7uem2814>>;
        /**
         * Drop the authorization held for a para id, at the parachain's request.
         *
         * Only callable by a trusted XCM origin (e.g. the Coretime chain), never by users. This is
         * the only way an authorization that never received its code goes away, and the manager
         * pays for it on the parachain: nothing here expires on its own.
         *
         * Answered with [`MessageToParaV1::CancelResponse`], which is what lets the parachain
         * release the deposit. Refused, and reported as such, if the code did land in the meantime
         * and the para is registered: the deposit is then owed after all.
         *
         * Cancelling something that was never pending is not an error. The request may simply have
         * been rejected here and the report lost, and the parachain still needs an answer it can
         * act on.
         */
        cancel_authorization: TxDescriptor<Anonymize<I3bmm0aglg28l9>>;
    };
};
type IEvent = {
    System: {
        /**
         * An extrinsic completed successfully.
         */
        ExtrinsicSuccess: PlainDescriptor<Anonymize<Ia82mnkmeo2rhc>>;
        /**
         * An extrinsic failed.
         */
        ExtrinsicFailed: PlainDescriptor<Anonymize<I638akia269ogg>>;
        /**
         * `:code` was updated to the code with the given hash.
         */
        CodeUpdated: PlainDescriptor<Anonymize<I1jm8m1rh9e20v>>;
        /**
         * A new account was created.
         */
        NewAccount: PlainDescriptor<Anonymize<Icbccs0ug47ilf>>;
        /**
         * An account was reaped.
         */
        KilledAccount: PlainDescriptor<Anonymize<Icbccs0ug47ilf>>;
        /**
         * On on-chain remark happened.
         */
        Remarked: PlainDescriptor<Anonymize<I855j4i3kr8ko1>>;
        /**
         * An upgrade was authorized.
         */
        UpgradeAuthorized: PlainDescriptor<Anonymize<Ibgl04rn6nbfm6>>;
        /**
         * An invalid authorized upgrade was rejected while trying to apply it.
         */
        RejectedInvalidAuthorizedUpgrade: PlainDescriptor<Anonymize<I1qjrksp5d26rv>>;
    };
    Utility: {
        /**
         * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
         * well as the error.
         */
        BatchInterrupted: PlainDescriptor<Anonymize<Idks0m2do620u9>>;
        /**
         * Batch of dispatches completed fully with no error.
         */
        BatchCompleted: PlainDescriptor<undefined>;
        /**
         * Batch of dispatches completed but has errors.
         */
        BatchCompletedWithErrors: PlainDescriptor<undefined>;
        /**
         * A single item within a Batch of dispatches has completed with no error.
         */
        ItemCompleted: PlainDescriptor<undefined>;
        /**
         * A single item within a Batch of dispatches has completed with error.
         */
        ItemFailed: PlainDescriptor<Anonymize<Ievr39qp5f2qfn>>;
        /**
         * A call was dispatched.
         */
        DispatchedAs: PlainDescriptor<Anonymize<I4e8ijo7sp17m7>>;
        /**
         * Main call was dispatched.
         */
        IfElseMainSuccess: PlainDescriptor<undefined>;
        /**
         * The fallback call was dispatched.
         */
        IfElseFallbackCalled: PlainDescriptor<Anonymize<I174g6ev4gb80t>>;
    };
    Indices: {
        /**
         * A account index was assigned.
         */
        IndexAssigned: PlainDescriptor<Anonymize<Ia1u3jll6a06ae>>;
        /**
         * A account index has been freed up (unassigned).
         */
        IndexFreed: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * A account index has been frozen to its current account ID.
         */
        IndexFrozen: PlainDescriptor<Anonymize<Ia1u3jll6a06ae>>;
        /**
         * A deposit to reserve an index has been poked/reconsidered.
         */
        DepositPoked: PlainDescriptor<Anonymize<Ic9g5lvl9iddc5>>;
    };
    Balances: {
        /**
         * An account was created with some free balance.
         */
        Endowed: PlainDescriptor<Anonymize<Icv68aq8841478>>;
        /**
         * An account was removed whose balance was non-zero but below ExistentialDeposit,
         * resulting in an outright loss.
         */
        DustLost: PlainDescriptor<Anonymize<Ic262ibdoec56a>>;
        /**
         * Transfer succeeded.
         */
        Transfer: PlainDescriptor<Anonymize<Iflcfm9b6nlmdd>>;
        /**
         * A balance was set by root.
         */
        BalanceSet: PlainDescriptor<Anonymize<Ijrsf4mnp3eka>>;
        /**
         * Some balance was reserved (moved from free to reserved).
         */
        Reserved: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * Some balance was unreserved (moved from reserved to free).
         */
        Unreserved: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * Some balance was moved from the reserve of the first account to the second account.
         * Final argument indicates the destination balance type.
         */
        ReserveRepatriated: PlainDescriptor<Anonymize<I8tjvj9uq4b7hi>>;
        /**
         * Some amount was deposited (e.g. for transaction fees).
         */
        Deposit: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * Some amount was withdrawn from the account (e.g. for transaction fees).
         */
        Withdraw: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * Some amount was removed from the account (e.g. for misbehavior).
         */
        Slashed: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * Some amount was minted into an account.
         */
        Minted: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * Some credit was balanced and added to the TotalIssuance.
         */
        MintedCredit: PlainDescriptor<Anonymize<I3qt1hgg4djhgb>>;
        /**
         * Some amount was burned from an account.
         */
        Burned: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * Some debt has been dropped from the Total Issuance.
         */
        BurnedDebt: PlainDescriptor<Anonymize<I3qt1hgg4djhgb>>;
        /**
         * Some amount was suspended from an account (it can be restored later).
         */
        Suspended: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * Some amount was restored into an account.
         */
        Restored: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * An account was upgraded.
         */
        Upgraded: PlainDescriptor<Anonymize<I4cbvqmqadhrea>>;
        /**
         * Total issuance was increased by `amount`, creating a credit to be balanced.
         */
        Issued: PlainDescriptor<Anonymize<I3qt1hgg4djhgb>>;
        /**
         * Total issuance was decreased by `amount`, creating a debt to be balanced.
         */
        Rescinded: PlainDescriptor<Anonymize<I3qt1hgg4djhgb>>;
        /**
         * Some balance was locked.
         */
        Locked: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * Some balance was unlocked.
         */
        Unlocked: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * Some balance was frozen.
         */
        Frozen: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * Some balance was thawed.
         */
        Thawed: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
        /**
         * The `TotalIssuance` was forcefully changed.
         */
        TotalIssuanceForced: PlainDescriptor<Anonymize<I4fooe9dun9o0t>>;
        /**
         * Some balance was placed on hold.
         */
        Held: PlainDescriptor<Anonymize<I8ikjg47gad5qs>>;
        /**
         * Held balance was burned from an account.
         */
        BurnedHeld: PlainDescriptor<Anonymize<I8ikjg47gad5qs>>;
        /**
         * A transfer of `amount` on hold from `source` to `dest` was initiated.
         */
        TransferOnHold: PlainDescriptor<Anonymize<Ieetn6hi5s8es8>>;
        /**
         * The `transferred` balance is placed on hold at the `dest` account.
         */
        TransferAndHold: PlainDescriptor<Anonymize<I7cq8k0l21g5rb>>;
        /**
         * Some balance was released from hold.
         */
        Released: PlainDescriptor<Anonymize<I8ikjg47gad5qs>>;
        /**
         * An unexpected/defensive event was triggered.
         */
        Unexpected: PlainDescriptor<Anonymize<Iph9c4rn81ub2>>;
    };
    TransactionPayment: {
        /**
         * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
         * has been paid by `who`.
         */
        TransactionFeePaid: PlainDescriptor<Anonymize<Ier2cke86dqbr2>>;
    };
    AssetConversionTxPayment: {
        /**
         * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
         * has been paid by `who` in an asset `asset_id`.
         */
        AssetTxFeePaid: PlainDescriptor<Anonymize<Icjn9u0mv2cnn4>>;
        /**
         * A swap of the refund in native currency back to asset failed.
         */
        AssetRefundFailed: PlainDescriptor<Anonymize<Icjchvrijclvlv>>;
    };
    ElectionProviderMultiPhase: {
        /**
         * A solution was stored with the given compute.
         *
         * The `origin` indicates the origin of the solution. If `origin` is `Some(AccountId)`,
         * the stored solution was submitted in the signed phase by a miner with the `AccountId`.
         * Otherwise, the solution was stored either during the unsigned phase or by
         * `T::ForceOrigin`. The `bool` is `true` when a previous solution was ejected to make
         * room for this one.
         */
        SolutionStored: PlainDescriptor<Anonymize<I4mol6k10mv0io>>;
        /**
         * The election has been finalized, with the given computation and score.
         */
        ElectionFinalized: PlainDescriptor<Anonymize<Iec90vukseit9e>>;
        /**
         * An election failed.
         *
         * Not much can be said about which computes failed in the process.
         */
        ElectionFailed: PlainDescriptor<undefined>;
        /**
         * An account has been rewarded for their signed submission being finalized.
         */
        Rewarded: PlainDescriptor<Anonymize<I7j4m7a3pkvsf4>>;
        /**
         * An account has been slashed for submitting an invalid signed submission.
         */
        Slashed: PlainDescriptor<Anonymize<I7j4m7a3pkvsf4>>;
        /**
         * There was a phase transition in a given round.
         */
        PhaseTransitioned: PlainDescriptor<Anonymize<Ic2n50kpnu5mae>>;
    };
    Staking: {
        /**
         * The era payout has been set; the first balance is the validator-payout; the second is
         * the remainder from the maximum amount of reward.
         */
        EraPaid: PlainDescriptor<Anonymize<I1au3fq4n84nv3>>;
        /**
         * The nominator has been rewarded by this amount to this destination.
         */
        Rewarded: PlainDescriptor<Anonymize<Iejaj7m7qka9tr>>;
        /**
         * A staker (validator or nominator) has been slashed by the given amount.
         */
        Slashed: PlainDescriptor<Anonymize<Idnak900lt5lm8>>;
        /**
         * A slash for the given validator, for the given percentage of their stake, at the given
         * era as been reported.
         */
        SlashReported: PlainDescriptor<Anonymize<I27n7lbd66730p>>;
        /**
         * An old slashing report from a prior era was discarded because it could
         * not be processed.
         */
        OldSlashingReportDiscarded: PlainDescriptor<Anonymize<I2hq50pu2kdjpo>>;
        /**
         * A new set of stakers was elected.
         */
        StakersElected: PlainDescriptor<undefined>;
        /**
         * An account has bonded this amount. \[stash, amount\]
         *
         * NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
         * it will not be emitted for staking rewards when they are added to stake.
         */
        Bonded: PlainDescriptor<Anonymize<Ifk8eme5o7mukf>>;
        /**
         * An account has unbonded this amount.
         */
        Unbonded: PlainDescriptor<Anonymize<Ifk8eme5o7mukf>>;
        /**
         * An account has called `withdraw_unbonded` and removed unbonding chunks worth `Balance`
         * from the unlocking queue.
         */
        Withdrawn: PlainDescriptor<Anonymize<Ifk8eme5o7mukf>>;
        /**
         * A nominator has been kicked from a validator.
         */
        Kicked: PlainDescriptor<Anonymize<Iau4cgm6ih61cf>>;
        /**
         * The election failed. No new era is planned.
         */
        StakingElectionFailed: PlainDescriptor<undefined>;
        /**
         * An account has stopped participating as either a validator or nominator.
         */
        Chilled: PlainDescriptor<Anonymize<Idl3umm12u5pa>>;
        /**
         * A Page of stakers rewards are getting paid. `next` is `None` if all pages are claimed.
         */
        PayoutStarted: PlainDescriptor<Anonymize<Ith132hqfb27q>>;
        /**
         * A validator has set their preferences.
         */
        ValidatorPrefsSet: PlainDescriptor<Anonymize<Ic19as7nbst738>>;
        /**
         * Voters size limit reached.
         */
        SnapshotVotersSizeExceeded: PlainDescriptor<Anonymize<I54umskavgc9du>>;
        /**
         * Targets size limit reached.
         */
        SnapshotTargetsSizeExceeded: PlainDescriptor<Anonymize<I54umskavgc9du>>;
        /**
         * A new force era mode was set.
         */
        ForceEra: PlainDescriptor<Anonymize<I2ip7o9e2tc5sf>>;
        /**
         * Report of a controller batch deprecation.
         */
        ControllerBatchDeprecated: PlainDescriptor<Anonymize<I5egvk6hadac5h>>;
        /**
         * Staking balance migrated from locks to holds, with any balance that could not be held
         * is force withdrawn.
         */
        CurrencyMigrated: PlainDescriptor<Anonymize<I1td4upnup9gqv>>;
    };
    Session: {
        /**
         * New session has happened. Note that the argument is the session index, not the
         * block number as the type might suggest.
         */
        NewSession: PlainDescriptor<Anonymize<I2hq50pu2kdjpo>>;
        /**
         * The `NewSession` event in the current block also implies a new validator set to be
         * queued.
         */
        NewQueued: PlainDescriptor<undefined>;
        /**
         * Validator has been disabled.
         */
        ValidatorDisabled: PlainDescriptor<Anonymize<I9acqruh7322g2>>;
        /**
         * Validator has been re-enabled.
         */
        ValidatorReenabled: PlainDescriptor<Anonymize<I9acqruh7322g2>>;
    };
    TechnicalCommittee: {
        /**
         * A motion (given hash) has been proposed (by given account) with a threshold (given
         * `MemberCount`).
         */
        Proposed: PlainDescriptor<Anonymize<Ift6f10887nk72>>;
        /**
         * A motion (given hash) has been voted on by given account, leaving
         * a tally (yes votes and no votes given respectively as `MemberCount`).
         */
        Voted: PlainDescriptor<Anonymize<I7qc53b1tvqjg2>>;
        /**
         * A motion was approved by the required threshold.
         */
        Approved: PlainDescriptor<Anonymize<I2ev73t79f46tb>>;
        /**
         * A motion was not approved by the required threshold.
         */
        Disapproved: PlainDescriptor<Anonymize<I2ev73t79f46tb>>;
        /**
         * A motion was executed; result will be `Ok` if it returned without error.
         */
        Executed: PlainDescriptor<Anonymize<I9dbtdtj06jbrc>>;
        /**
         * A single member did some action; result will be `Ok` if it returned without error.
         */
        MemberExecuted: PlainDescriptor<Anonymize<I9dbtdtj06jbrc>>;
        /**
         * A proposal was closed because its threshold was reached or after its duration was up.
         */
        Closed: PlainDescriptor<Anonymize<Iak7fhrgb9jnnq>>;
        /**
         * A proposal was killed.
         */
        Killed: PlainDescriptor<Anonymize<I2ev73t79f46tb>>;
        /**
         * Some cost for storing a proposal was burned.
         */
        ProposalCostBurned: PlainDescriptor<Anonymize<I9ad1o9mv4cm3>>;
        /**
         * Some cost for storing a proposal was released.
         */
        ProposalCostReleased: PlainDescriptor<Anonymize<I9ad1o9mv4cm3>>;
    };
    TechnicalMembership: {
        /**
         * The given member was added; see the transaction for who.
         */
        MemberAdded: PlainDescriptor<undefined>;
        /**
         * The given member was removed; see the transaction for who.
         */
        MemberRemoved: PlainDescriptor<undefined>;
        /**
         * Two members were swapped; see the transaction for who.
         */
        MembersSwapped: PlainDescriptor<undefined>;
        /**
         * The membership was reset; see the transaction for who the new set is.
         */
        MembersReset: PlainDescriptor<undefined>;
        /**
         * One of the members' keys changed.
         */
        KeyChanged: PlainDescriptor<undefined>;
        /**
         * Phantom member, never used.
         */
        Dummy: PlainDescriptor<undefined>;
    };
    Grandpa: {
        /**
         * New authority set has been applied.
         */
        NewAuthorities: PlainDescriptor<Anonymize<I5768ac424h061>>;
        /**
         * Current authority set has been paused.
         */
        Paused: PlainDescriptor<undefined>;
        /**
         * Current authority set has been resumed.
         */
        Resumed: PlainDescriptor<undefined>;
    };
    Treasury: {
        /**
         * We have ended a spend period and will now allocate funds.
         */
        Spending: PlainDescriptor<Anonymize<I8iksqi3eani0a>>;
        /**
         * Some funds have been allocated.
         */
        Awarded: PlainDescriptor<Anonymize<I16enopmju1p0q>>;
        /**
         * Some of our funds have been burnt.
         */
        Burnt: PlainDescriptor<Anonymize<I43kq8qudg7pq9>>;
        /**
         * Spending has finished; this is the amount that rolls over until next spend.
         */
        Rollover: PlainDescriptor<Anonymize<I76riseemre533>>;
        /**
         * Some funds have been deposited.
         */
        Deposit: PlainDescriptor<Anonymize<Ie5v6njpckr05b>>;
        /**
         * A new spend proposal has been approved.
         */
        SpendApproved: PlainDescriptor<Anonymize<I38bmcrmh852rk>>;
        /**
         * The inactive funds of the pallet have been updated.
         */
        UpdatedInactive: PlainDescriptor<Anonymize<I4hcillge8de5f>>;
        /**
         * A new asset spend proposal has been approved.
         */
        AssetSpendApproved: PlainDescriptor<Anonymize<I97u3kqqqkf4si>>;
        /**
         * An approved spend was voided.
         */
        AssetSpendVoided: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * A payment happened.
         */
        Paid: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * A payment failed and can be retried.
         */
        PaymentFailed: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * A spend was processed and removed from the storage. It might have been successfully
         * paid or it may have expired.
         */
        SpendProcessed: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    };
    AssetRate: {
        /**
        
         */
        AssetRateCreated: PlainDescriptor<Anonymize<Ies1efup9f14ih>>;
        /**
        
         */
        AssetRateRemoved: PlainDescriptor<Anonymize<Iunnigs2ph8da>>;
        /**
        
         */
        AssetRateUpdated: PlainDescriptor<Anonymize<Iasudo93amopi2>>;
    };
    Contracts: {
        /**
         * Contract deployed by address at the specified address.
         */
        Instantiated: PlainDescriptor<Anonymize<Ie5222qfrr24ek>>;
        /**
         * Contract has been removed.
         *
         * # Note
         *
         * The only way for a contract to be removed and emitting this event is by calling
         * `seal_terminate`.
         */
        Terminated: PlainDescriptor<Anonymize<I28g8sphdu312k>>;
        /**
         * Code with the specified hash has been stored.
         */
        CodeStored: PlainDescriptor<Anonymize<Idqbjt2c6r46t6>>;
        /**
         * A custom event emitted by the contract.
         */
        ContractEmitted: PlainDescriptor<Anonymize<I853aigjva3f0t>>;
        /**
         * A code with the specified hash was removed.
         */
        CodeRemoved: PlainDescriptor<Anonymize<I9uehhems5hkqm>>;
        /**
         * A contract's code was updated.
         */
        ContractCodeUpdated: PlainDescriptor<Anonymize<I7q5qk4uoanhof>>;
        /**
         * A contract was called either by a plain account or another contract.
         *
         * # Note
         *
         * Please keep in mind that like all events this is only emitted for successful
         * calls. This is because on failure all storage changes including events are
         * rolled back.
         */
        Called: PlainDescriptor<Anonymize<Iehpbs40l3jkit>>;
        /**
         * A contract delegate called a code hash.
         *
         * # Note
         *
         * Please keep in mind that like all events this is only emitted for successful
         * calls. This is because on failure all storage changes including events are
         * rolled back.
         */
        DelegateCalled: PlainDescriptor<Anonymize<Idht9upmipvd4j>>;
        /**
         * Some funds have been transferred and held as storage deposit.
         */
        StorageDepositTransferredAndHeld: PlainDescriptor<Anonymize<Iflcfm9b6nlmdd>>;
        /**
         * Some storage deposit funds have been transferred and released.
         */
        StorageDepositTransferredAndReleased: PlainDescriptor<Anonymize<Iflcfm9b6nlmdd>>;
    };
    Sudo: {
        /**
         * A sudo call just took place.
         */
        Sudid: PlainDescriptor<Anonymize<I7png4ljr2t3ad>>;
        /**
         * The sudo key has been updated.
         */
        KeyChanged: PlainDescriptor<Anonymize<I5rtkmhm2dng4u>>;
        /**
         * The key was permanently removed.
         */
        KeyRemoved: PlainDescriptor<undefined>;
        /**
         * A [sudo_as](Pallet::sudo_as) call just took place.
         */
        SudoAsDone: PlainDescriptor<Anonymize<I7png4ljr2t3ad>>;
    };
    ImOnline: {
        /**
         * A new heartbeat was received from `AuthorityId`.
         */
        HeartbeatReceived: PlainDescriptor<Anonymize<I6niuoceqveh04>>;
        /**
         * At the end of the session, no offence was committed.
         */
        AllGood: PlainDescriptor<undefined>;
        /**
         * At the end of the session, at least one validator was found to be offline.
         */
        SomeOffline: PlainDescriptor<Anonymize<Iksn90easbs68>>;
    };
    Offences: {
        /**
         * There is an offence reported of the given `kind` happened at the `session_index` and
         * (kind-specific) time slot. This event is not deposited for duplicate slashes.
         * \[kind, slot\].
         */
        Offence: PlainDescriptor<Anonymize<I2bhk17btucdqn>>;
    };
    Historical: {
        /**
         * The merkle root of the validators of the said session were stored
         */
        RootStored: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * The merkle roots of up to this session index were pruned
         */
        RootsPruned: PlainDescriptor<Anonymize<I85icj2qbjeqbe>>;
    };
    Identity: {
        /**
         * A name was set or reset (which will remove all judgements).
         */
        IdentitySet: PlainDescriptor<Anonymize<I4cbvqmqadhrea>>;
        /**
         * A name was cleared, and the given balance returned.
         */
        IdentityCleared: PlainDescriptor<Anonymize<Iep1lmt6q3s6r3>>;
        /**
         * A name was removed and the given balance slashed.
         */
        IdentityKilled: PlainDescriptor<Anonymize<Iep1lmt6q3s6r3>>;
        /**
         * A judgement was asked from a registrar.
         */
        JudgementRequested: PlainDescriptor<Anonymize<I1fac16213rie2>>;
        /**
         * A judgement request was retracted.
         */
        JudgementUnrequested: PlainDescriptor<Anonymize<I1fac16213rie2>>;
        /**
         * A judgement was given by a registrar.
         */
        JudgementGiven: PlainDescriptor<Anonymize<Ifjt77oc391o43>>;
        /**
         * A registrar was added.
         */
        RegistrarAdded: PlainDescriptor<Anonymize<Itvt1jsipv0lc>>;
        /**
         * A registrar was removed.
         */
        RegistrarRemoved: PlainDescriptor<Anonymize<Itvt1jsipv0lc>>;
        /**
         * A sub-identity was added to an identity and the deposit paid.
         */
        SubIdentityAdded: PlainDescriptor<Anonymize<Ick3mveut33f44>>;
        /**
         * An account's sub-identities were set (in bulk).
         */
        SubIdentitiesSet: PlainDescriptor<Anonymize<I719lqkkbtikbl>>;
        /**
         * A given sub-account's associated name was changed by its super-identity.
         */
        SubIdentityRenamed: PlainDescriptor<Anonymize<Ie4intrc3n8jfu>>;
        /**
         * A sub-identity was removed from an identity and the deposit freed.
         */
        SubIdentityRemoved: PlainDescriptor<Anonymize<Ick3mveut33f44>>;
        /**
         * A sub-identity was cleared, and the given deposit repatriated from the
         * main identity account to the sub-identity account.
         */
        SubIdentityRevoked: PlainDescriptor<Anonymize<Ick3mveut33f44>>;
        /**
         * A username authority was added.
         */
        AuthorityAdded: PlainDescriptor<Anonymize<I2rg5btjrsqec0>>;
        /**
         * A username authority was removed.
         */
        AuthorityRemoved: PlainDescriptor<Anonymize<I2rg5btjrsqec0>>;
        /**
         * A username was set for `who`.
         */
        UsernameSet: PlainDescriptor<Anonymize<Ibdqerrooruuq9>>;
        /**
         * A username was queued, but `who` must accept it prior to `expiration`.
         */
        UsernameQueued: PlainDescriptor<Anonymize<I8u2ba9jeiu6q0>>;
        /**
         * A queued username passed its expiration without being claimed and was removed.
         */
        PreapprovalExpired: PlainDescriptor<Anonymize<I7ieadb293k6b4>>;
        /**
         * A username was set as a primary and can be looked up from `who`.
         */
        PrimaryUsernameSet: PlainDescriptor<Anonymize<Ibdqerrooruuq9>>;
        /**
         * A dangling username (as in, a username corresponding to an account that has removed its
         * identity) has been removed.
         */
        DanglingUsernameRemoved: PlainDescriptor<Anonymize<Ibdqerrooruuq9>>;
        /**
         * A username has been unbound.
         */
        UsernameUnbound: PlainDescriptor<Anonymize<Ie5l999tf7t2te>>;
        /**
         * A username has been removed.
         */
        UsernameRemoved: PlainDescriptor<Anonymize<Ie5l999tf7t2te>>;
        /**
         * A username has been killed.
         */
        UsernameKilled: PlainDescriptor<Anonymize<Ie5l999tf7t2te>>;
    };
    Recovery: {
        /**
         * A recovery attempt was approved by a friend.
         */
        AttemptApproved: PlainDescriptor<Anonymize<I74cgu8np39n0l>>;
        /**
         * A recovery attempt was canceled by either the lost account or the initiator.
         */
        AttemptCanceled: PlainDescriptor<Anonymize<I25orvb54q88dl>>;
        /**
         * A recovery attempt was initiated by a friend.
         */
        AttemptInitiated: PlainDescriptor<Anonymize<Ib729ncvntj6ge>>;
        /**
         * A recovery attempt was finished.
         */
        AttemptFinished: PlainDescriptor<Anonymize<Icsmfeouh6gri7>>;
        /**
         * A recovery attempt was discarded because the account was already recovered by a
         * friend group of equal or higher priority.
         *
         * The attempt is consumed (removed from storage) and its deposits are released, but
         * the existing inheritor remains unchanged.
         */
        AttemptDiscarded: PlainDescriptor<Anonymize<Icj1c576oljupp>>;
        /**
         * A recovery attempt was slashed by the lost account.
         *
         * The initiator will lose their security deposit.
         */
        AttemptSlashed: PlainDescriptor<Anonymize<I2c8c7v4oadht4>>;
        /**
         * The friend groups of an account have been changed.
         */
        FriendGroupsChanged: PlainDescriptor<Anonymize<I6v43d5vj613hc>>;
        /**
         * The inheritor of a lost account was revoked by the lost account.
         */
        InheritorRevoked: PlainDescriptor<Anonymize<I6v43d5vj613hc>>;
        /**
         * A recovered account was controlled by its inheritor.
         *
         * Check the `call_result` to see if it was successful.
         */
        RecoveredAccountControlled: PlainDescriptor<Anonymize<I5nf2t4nnfae4i>>;
    };
    Vesting: {
        /**
         * A vesting schedule has been created.
         */
        VestingCreated: PlainDescriptor<Anonymize<Ih04jp733tqqa>>;
        /**
         * The amount vested has been updated. This could indicate a change in funds available.
         * The balance given is the amount which is left unvested (and thus locked).
         */
        VestingUpdated: PlainDescriptor<Anonymize<Ievr89968437gm>>;
        /**
         * An \[account\] has become fully vested.
         */
        VestingCompleted: PlainDescriptor<Anonymize<Icbccs0ug47ilf>>;
    };
    Scheduler: {
        /**
         * Scheduled some task.
         */
        Scheduled: PlainDescriptor<Anonymize<I5n4sebgkfr760>>;
        /**
         * Canceled some task.
         */
        Canceled: PlainDescriptor<Anonymize<I5n4sebgkfr760>>;
        /**
         * Dispatched some task.
         */
        Dispatched: PlainDescriptor<Anonymize<I5o687olbd097v>>;
        /**
         * Set a retry configuration for some task.
         */
        RetrySet: PlainDescriptor<Anonymize<Ia3c82eadg79bj>>;
        /**
         * Cancel a retry configuration for some task.
         */
        RetryCancelled: PlainDescriptor<Anonymize<Ienusoeb625ftq>>;
        /**
         * The call for the provided hash was not found so the task has been aborted.
         */
        CallUnavailable: PlainDescriptor<Anonymize<Ienusoeb625ftq>>;
        /**
         * The given task was unable to be renewed since the agenda is full at that block.
         */
        PeriodicFailed: PlainDescriptor<Anonymize<Ienusoeb625ftq>>;
        /**
         * The given task was unable to be retried since the agenda is full at that block or there
         * was not enough weight to reschedule it.
         */
        RetryFailed: PlainDescriptor<Anonymize<Ienusoeb625ftq>>;
        /**
         * The given task can never be executed since it is overweight.
         */
        PermanentlyOverweight: PlainDescriptor<Anonymize<Ienusoeb625ftq>>;
        /**
         * Agenda is incomplete from `when`.
         */
        AgendaIncomplete: PlainDescriptor<Anonymize<Ibtsa3docbr9el>>;
    };
    Preimage: {
        /**
         * A preimage has been noted.
         */
        Noted: PlainDescriptor<Anonymize<I1jm8m1rh9e20v>>;
        /**
         * A preimage has been requested.
         */
        Requested: PlainDescriptor<Anonymize<I1jm8m1rh9e20v>>;
        /**
         * A preimage has ben cleared.
         */
        Cleared: PlainDescriptor<Anonymize<I1jm8m1rh9e20v>>;
    };
    Proxy: {
        /**
         * A proxy was executed correctly, with the given.
         */
        ProxyExecuted: PlainDescriptor<Anonymize<I4e8ijo7sp17m7>>;
        /**
         * A pure account has been created by new proxy with given
         * disambiguation index and proxy type.
         */
        PureCreated: PlainDescriptor<Anonymize<I39lfgq5bja17p>>;
        /**
         * A pure proxy was killed by its spawner.
         */
        PureKilled: PlainDescriptor<Anonymize<I6vrp2049vcgir>>;
        /**
         * An announcement was placed to make a call in the future.
         */
        Announced: PlainDescriptor<Anonymize<I2ur0oeqg495j8>>;
        /**
         * A proxy was added.
         */
        ProxyAdded: PlainDescriptor<Anonymize<I3g2abs6vce9f8>>;
        /**
         * A proxy was removed.
         */
        ProxyRemoved: PlainDescriptor<Anonymize<I3g2abs6vce9f8>>;
        /**
         * A deposit stored for proxies or announcements was poked / updated.
         */
        DepositPoked: PlainDescriptor<Anonymize<I1bhd210c3phjj>>;
    };
    Multisig: {
        /**
         * A new multisig operation has begun.
         */
        NewMultisig: PlainDescriptor<Anonymize<Iep27ialq4a7o7>>;
        /**
         * A multisig operation has been approved by someone.
         */
        MultisigApproval: PlainDescriptor<Anonymize<Iasu5jvoqr43mv>>;
        /**
         * A multisig operation has been executed.
         */
        MultisigExecuted: PlainDescriptor<Anonymize<I62e0di1bmjcu8>>;
        /**
         * A multisig operation has been cancelled.
         */
        MultisigCancelled: PlainDescriptor<Anonymize<I5qolde99acmd1>>;
        /**
         * The deposit for a multisig operation has been updated/poked.
         */
        DepositPoked: PlainDescriptor<Anonymize<I8gtde5abn1g9a>>;
    };
    Bounties: {
        /**
         * New bounty proposal.
         */
        BountyProposed: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * A bounty proposal was rejected; funds were slashed.
         */
        BountyRejected: PlainDescriptor<Anonymize<Id9idaj83175f9>>;
        /**
         * A bounty proposal is funded and became active.
         */
        BountyBecameActive: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * A bounty is awarded to a beneficiary.
         */
        BountyAwarded: PlainDescriptor<Anonymize<Ie1semicfuv5uu>>;
        /**
         * A bounty is claimed by beneficiary.
         */
        BountyClaimed: PlainDescriptor<Anonymize<If25fjs9o37co1>>;
        /**
         * A bounty is cancelled.
         */
        BountyCanceled: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * A bounty expiry is extended.
         */
        BountyExtended: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * A bounty is approved.
         */
        BountyApproved: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * A bounty curator is proposed.
         */
        CuratorProposed: PlainDescriptor<Anonymize<I70sc1pdo8vtos>>;
        /**
         * A bounty curator is unassigned.
         */
        CuratorUnassigned: PlainDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
        /**
         * A bounty curator is accepted.
         */
        CuratorAccepted: PlainDescriptor<Anonymize<I70sc1pdo8vtos>>;
        /**
         * A bounty deposit has been poked.
         */
        DepositPoked: PlainDescriptor<Anonymize<Ibck5e4jpm96l8>>;
        /**
         * Stranded funds left in a closed bounty's account were reclaimed to the treasury.
         */
        BountyFundsReclaimed: PlainDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
    };
    Assets: {
        /**
         * Some asset class was created.
         */
        Created: PlainDescriptor<Anonymize<I88ff3u4dpivk>>;
        /**
         * Some assets were issued.
         */
        Issued: PlainDescriptor<Anonymize<I33cp947glv1ks>>;
        /**
         * Some assets were transferred.
         */
        Transferred: PlainDescriptor<Anonymize<Ic9om1gmmqu7rq>>;
        /**
         * Some assets were destroyed.
         */
        Burned: PlainDescriptor<Anonymize<I5hfov2b68ppb6>>;
        /**
         * The management team changed.
         */
        TeamChanged: PlainDescriptor<Anonymize<Ibthhb2m9vneds>>;
        /**
         * The owner changed.
         */
        OwnerChanged: PlainDescriptor<Anonymize<Iaitn5bqfacj7k>>;
        /**
         * Some account `who` was frozen.
         */
        Frozen: PlainDescriptor<Anonymize<If4ebvclj2ugvi>>;
        /**
         * Some account `who` was thawed.
         */
        Thawed: PlainDescriptor<Anonymize<If4ebvclj2ugvi>>;
        /**
         * Some asset `asset_id` was frozen.
         */
        AssetFrozen: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * Some asset `asset_id` was thawed.
         */
        AssetThawed: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * Accounts were destroyed for given asset.
         */
        AccountsDestroyed: PlainDescriptor<Anonymize<Ieduc1e6frq8rb>>;
        /**
         * Approvals were destroyed for given asset.
         */
        ApprovalsDestroyed: PlainDescriptor<Anonymize<I9h6gbtabovtm4>>;
        /**
         * An asset class is in the process of being destroyed.
         */
        DestructionStarted: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * An asset class was destroyed.
         */
        Destroyed: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * Some asset class was force-created.
         */
        ForceCreated: PlainDescriptor<Anonymize<Iaitn5bqfacj7k>>;
        /**
         * New metadata has been set for an asset.
         */
        MetadataSet: PlainDescriptor<Anonymize<Ifnsa0dkkpf465>>;
        /**
         * Metadata has been cleared for an asset.
         */
        MetadataCleared: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * (Additional) funds have been approved for transfer to a destination account.
         */
        ApprovedTransfer: PlainDescriptor<Anonymize<I65dtqr2egjbc3>>;
        /**
         * An approval for account `delegate` was cancelled by `owner`.
         */
        ApprovalCancelled: PlainDescriptor<Anonymize<Ibqj3vg5s5lk0c>>;
        /**
         * An `amount` was transferred in its entirety from `owner` to `destination` by
         * the approved `delegate`.
         */
        TransferredApproved: PlainDescriptor<Anonymize<I6l73u513p8rna>>;
        /**
         * An asset has had its attributes changed by the `Force` origin.
         */
        AssetStatusChanged: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * The min_balance of an asset has been updated by the asset owner.
         */
        AssetMinBalanceChanged: PlainDescriptor<Anonymize<Iefqmt2htu1dlu>>;
        /**
         * Some account `who` was created with a deposit from `depositor`.
         */
        Touched: PlainDescriptor<Anonymize<If8bgtgqrchjtu>>;
        /**
         * Some account `who` was blocked.
         */
        Blocked: PlainDescriptor<Anonymize<If4ebvclj2ugvi>>;
        /**
         * Some assets were deposited (e.g. for transaction fees).
         */
        Deposited: PlainDescriptor<Anonymize<Idusmq77988cmt>>;
        /**
         * Some assets were withdrawn from the account (e.g. for transaction fees).
         */
        Withdrawn: PlainDescriptor<Anonymize<Idusmq77988cmt>>;
        /**
         * Reserve information was set or updated for `asset_id`.
         */
        ReservesUpdated: PlainDescriptor<Anonymize<Ifhs6ggbuiec5i>>;
        /**
         * Reserve information was removed for `asset_id`.
         */
        ReservesRemoved: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * Some assets were issued as Credit (no owner yet).
         */
        IssuedCredit: PlainDescriptor<Anonymize<Id2vo4qi5agnp0>>;
        /**
         * Some assets Credit was destroyed.
         */
        BurnedCredit: PlainDescriptor<Anonymize<Id2vo4qi5agnp0>>;
        /**
         * Some assets were burned and a Debt was created.
         */
        IssuedDebt: PlainDescriptor<Anonymize<Id2vo4qi5agnp0>>;
        /**
         * Some assets Debt was destroyed (and assets issued).
         */
        BurnedDebt: PlainDescriptor<Anonymize<Id2vo4qi5agnp0>>;
    };
    PoolAssets: {
        /**
         * Some asset class was created.
         */
        Created: PlainDescriptor<Anonymize<I88ff3u4dpivk>>;
        /**
         * Some assets were issued.
         */
        Issued: PlainDescriptor<Anonymize<I33cp947glv1ks>>;
        /**
         * Some assets were transferred.
         */
        Transferred: PlainDescriptor<Anonymize<Ic9om1gmmqu7rq>>;
        /**
         * Some assets were destroyed.
         */
        Burned: PlainDescriptor<Anonymize<I5hfov2b68ppb6>>;
        /**
         * The management team changed.
         */
        TeamChanged: PlainDescriptor<Anonymize<Ibthhb2m9vneds>>;
        /**
         * The owner changed.
         */
        OwnerChanged: PlainDescriptor<Anonymize<Iaitn5bqfacj7k>>;
        /**
         * Some account `who` was frozen.
         */
        Frozen: PlainDescriptor<Anonymize<If4ebvclj2ugvi>>;
        /**
         * Some account `who` was thawed.
         */
        Thawed: PlainDescriptor<Anonymize<If4ebvclj2ugvi>>;
        /**
         * Some asset `asset_id` was frozen.
         */
        AssetFrozen: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * Some asset `asset_id` was thawed.
         */
        AssetThawed: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * Accounts were destroyed for given asset.
         */
        AccountsDestroyed: PlainDescriptor<Anonymize<Ieduc1e6frq8rb>>;
        /**
         * Approvals were destroyed for given asset.
         */
        ApprovalsDestroyed: PlainDescriptor<Anonymize<I9h6gbtabovtm4>>;
        /**
         * An asset class is in the process of being destroyed.
         */
        DestructionStarted: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * An asset class was destroyed.
         */
        Destroyed: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * Some asset class was force-created.
         */
        ForceCreated: PlainDescriptor<Anonymize<Iaitn5bqfacj7k>>;
        /**
         * New metadata has been set for an asset.
         */
        MetadataSet: PlainDescriptor<Anonymize<Ifnsa0dkkpf465>>;
        /**
         * Metadata has been cleared for an asset.
         */
        MetadataCleared: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * (Additional) funds have been approved for transfer to a destination account.
         */
        ApprovedTransfer: PlainDescriptor<Anonymize<I65dtqr2egjbc3>>;
        /**
         * An approval for account `delegate` was cancelled by `owner`.
         */
        ApprovalCancelled: PlainDescriptor<Anonymize<Ibqj3vg5s5lk0c>>;
        /**
         * An `amount` was transferred in its entirety from `owner` to `destination` by
         * the approved `delegate`.
         */
        TransferredApproved: PlainDescriptor<Anonymize<I6l73u513p8rna>>;
        /**
         * An asset has had its attributes changed by the `Force` origin.
         */
        AssetStatusChanged: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * The min_balance of an asset has been updated by the asset owner.
         */
        AssetMinBalanceChanged: PlainDescriptor<Anonymize<Iefqmt2htu1dlu>>;
        /**
         * Some account `who` was created with a deposit from `depositor`.
         */
        Touched: PlainDescriptor<Anonymize<If8bgtgqrchjtu>>;
        /**
         * Some account `who` was blocked.
         */
        Blocked: PlainDescriptor<Anonymize<If4ebvclj2ugvi>>;
        /**
         * Some assets were deposited (e.g. for transaction fees).
         */
        Deposited: PlainDescriptor<Anonymize<Idusmq77988cmt>>;
        /**
         * Some assets were withdrawn from the account (e.g. for transaction fees).
         */
        Withdrawn: PlainDescriptor<Anonymize<Idusmq77988cmt>>;
        /**
         * Reserve information was set or updated for `asset_id`.
         */
        ReservesUpdated: PlainDescriptor<Anonymize<Ifhs6ggbuiec5i>>;
        /**
         * Reserve information was removed for `asset_id`.
         */
        ReservesRemoved: PlainDescriptor<Anonymize<Ia5le7udkgbaq9>>;
        /**
         * Some assets were issued as Credit (no owner yet).
         */
        IssuedCredit: PlainDescriptor<Anonymize<Id2vo4qi5agnp0>>;
        /**
         * Some assets Credit was destroyed.
         */
        BurnedCredit: PlainDescriptor<Anonymize<Id2vo4qi5agnp0>>;
        /**
         * Some assets were burned and a Debt was created.
         */
        IssuedDebt: PlainDescriptor<Anonymize<Id2vo4qi5agnp0>>;
        /**
         * Some assets Debt was destroyed (and assets issued).
         */
        BurnedDebt: PlainDescriptor<Anonymize<Id2vo4qi5agnp0>>;
    };
    Lottery: {
        /**
         * A lottery has been started!
         */
        LotteryStarted: PlainDescriptor<undefined>;
        /**
         * A new set of calls have been set!
         */
        CallsUpdated: PlainDescriptor<undefined>;
        /**
         * A winner has been chosen!
         */
        Winner: PlainDescriptor<Anonymize<Idtfinpnsamten>>;
        /**
         * A ticket has been bought!
         */
        TicketBought: PlainDescriptor<Anonymize<I455dk0vr5anih>>;
    };
    Uniques: {
        /**
         * A `collection` was created.
         */
        Created: PlainDescriptor<Anonymize<I9gqanbbbe917p>>;
        /**
         * A `collection` was force-created.
         */
        ForceCreated: PlainDescriptor<Anonymize<Id1m1230297f7a>>;
        /**
         * A `collection` was destroyed.
         */
        Destroyed: PlainDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * An `item` was issued.
         */
        Issued: PlainDescriptor<Anonymize<Ifvb1p5munhhv4>>;
        /**
         * An `item` was transferred.
         */
        Transferred: PlainDescriptor<Anonymize<I46h83ilqeed3g>>;
        /**
         * An `item` was destroyed.
         */
        Burned: PlainDescriptor<Anonymize<Ifvb1p5munhhv4>>;
        /**
         * Some `item` was frozen.
         */
        Frozen: PlainDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * Some `item` was thawed.
         */
        Thawed: PlainDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * Some `collection` was frozen.
         */
        CollectionFrozen: PlainDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * Some `collection` was thawed.
         */
        CollectionThawed: PlainDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * The owner changed.
         */
        OwnerChanged: PlainDescriptor<Anonymize<Icahse3uoi76n7>>;
        /**
         * The management team changed.
         */
        TeamChanged: PlainDescriptor<Anonymize<I75sj3uv7gnemk>>;
        /**
         * An `item` of a `collection` has been approved by the `owner` for transfer by
         * a `delegate`.
         */
        ApprovedTransfer: PlainDescriptor<Anonymize<I5fjkvcb5vr6nb>>;
        /**
         * An approval for a `delegate` account to transfer the `item` of an item
         * `collection` was cancelled by its `owner`.
         */
        ApprovalCancelled: PlainDescriptor<Anonymize<I5fjkvcb5vr6nb>>;
        /**
         * A `collection` has had its attributes changed by the `Force` origin.
         */
        ItemStatusChanged: PlainDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * New metadata has been set for a `collection`.
         */
        CollectionMetadataSet: PlainDescriptor<Anonymize<I9viqhmdtuof5e>>;
        /**
         * Metadata has been cleared for a `collection`.
         */
        CollectionMetadataCleared: PlainDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * New metadata has been set for an item.
         */
        MetadataSet: PlainDescriptor<Anonymize<Iceq9fmmp9aeqv>>;
        /**
         * Metadata has been cleared for an item.
         */
        MetadataCleared: PlainDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * Metadata has been cleared for an item.
         */
        Redeposited: PlainDescriptor<Anonymize<I2gr1toekv86b9>>;
        /**
         * New attribute metadata has been set for a `collection` or `item`.
         */
        AttributeSet: PlainDescriptor<Anonymize<I5tvvgui05tn6e>>;
        /**
         * Attribute metadata has been cleared for a `collection` or `item`.
         */
        AttributeCleared: PlainDescriptor<Anonymize<Ibal0joadvdc2h>>;
        /**
         * Ownership acceptance has changed for an account.
         */
        OwnershipAcceptanceChanged: PlainDescriptor<Anonymize<I2v2ikqt2trp52>>;
        /**
         * Max supply has been set for a collection.
         */
        CollectionMaxSupplySet: PlainDescriptor<Anonymize<I6h88h8vba22v8>>;
        /**
         * The price was set for the instance.
         */
        ItemPriceSet: PlainDescriptor<Anonymize<If3057hi1g5qlo>>;
        /**
         * The price for the instance was removed.
         */
        ItemPriceRemoved: PlainDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * An item was bought.
         */
        ItemBought: PlainDescriptor<Anonymize<Iaii5qf41d5n3d>>;
    };
    Nfts: {
        /**
         * A `collection` was created.
         */
        Created: PlainDescriptor<Anonymize<I9gqanbbbe917p>>;
        /**
         * A `collection` was force-created.
         */
        ForceCreated: PlainDescriptor<Anonymize<Id1m1230297f7a>>;
        /**
         * A `collection` was destroyed.
         */
        Destroyed: PlainDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * An `item` was issued.
         */
        Issued: PlainDescriptor<Anonymize<Ifvb1p5munhhv4>>;
        /**
         * An `item` was transferred.
         */
        Transferred: PlainDescriptor<Anonymize<I46h83ilqeed3g>>;
        /**
         * An `item` was destroyed.
         */
        Burned: PlainDescriptor<Anonymize<Ifvb1p5munhhv4>>;
        /**
         * An `item` became non-transferable.
         */
        ItemTransferLocked: PlainDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * An `item` became transferable.
         */
        ItemTransferUnlocked: PlainDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * `item` metadata or attributes were locked.
         */
        ItemPropertiesLocked: PlainDescriptor<Anonymize<I1jj31tn29ie3c>>;
        /**
         * Some `collection` was locked.
         */
        CollectionLocked: PlainDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * The owner changed.
         */
        OwnerChanged: PlainDescriptor<Anonymize<Icahse3uoi76n7>>;
        /**
         * The management team changed.
         */
        TeamChanged: PlainDescriptor<Anonymize<Ico8bnjc6taa27>>;
        /**
         * An `item` of a `collection` has been approved by the `owner` for transfer by
         * a `delegate`.
         */
        TransferApproved: PlainDescriptor<Anonymize<I78i1bvlonei69>>;
        /**
         * An approval for a `delegate` account to transfer the `item` of an item
         * `collection` was cancelled by its `owner`.
         */
        ApprovalCancelled: PlainDescriptor<Anonymize<I5fjkvcb5vr6nb>>;
        /**
         * All approvals of an item got cancelled.
         */
        AllApprovalsCancelled: PlainDescriptor<Anonymize<Ifvb1p5munhhv4>>;
        /**
         * A `collection` has had its config changed by the `Force` origin.
         */
        CollectionConfigChanged: PlainDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * New metadata has been set for a `collection`.
         */
        CollectionMetadataSet: PlainDescriptor<Anonymize<I78u60nqh0etah>>;
        /**
         * Metadata has been cleared for a `collection`.
         */
        CollectionMetadataCleared: PlainDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * New metadata has been set for an item.
         */
        ItemMetadataSet: PlainDescriptor<Anonymize<Icrkms46uh8tpb>>;
        /**
         * Metadata has been cleared for an item.
         */
        ItemMetadataCleared: PlainDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * The deposit for a set of `item`s within a `collection` has been updated.
         */
        Redeposited: PlainDescriptor<Anonymize<I2gr1toekv86b9>>;
        /**
         * New attribute metadata has been set for a `collection` or `item`.
         */
        AttributeSet: PlainDescriptor<Anonymize<I5llu6o6a0go5i>>;
        /**
         * Attribute metadata has been cleared for a `collection` or `item`.
         */
        AttributeCleared: PlainDescriptor<Anonymize<I93r2effh7od84>>;
        /**
         * A new approval to modify item attributes was added.
         */
        ItemAttributesApprovalAdded: PlainDescriptor<Anonymize<I9i1f9mrso1hmf>>;
        /**
         * A new approval to modify item attributes was removed.
         */
        ItemAttributesApprovalRemoved: PlainDescriptor<Anonymize<I9i1f9mrso1hmf>>;
        /**
         * Ownership acceptance has changed for an account.
         */
        OwnershipAcceptanceChanged: PlainDescriptor<Anonymize<I2v2ikqt2trp52>>;
        /**
         * Max supply has been set for a collection.
         */
        CollectionMaxSupplySet: PlainDescriptor<Anonymize<I6h88h8vba22v8>>;
        /**
         * Mint settings for a collection had changed.
         */
        CollectionMintSettingsUpdated: PlainDescriptor<Anonymize<I6cu7obfo0rr0o>>;
        /**
         * Event gets emitted when the `NextCollectionId` gets incremented.
         */
        NextCollectionIdIncremented: PlainDescriptor<Anonymize<I9ksla2si91s56>>;
        /**
         * The price was set for the item.
         */
        ItemPriceSet: PlainDescriptor<Anonymize<If3057hi1g5qlo>>;
        /**
         * The price for the item was removed.
         */
        ItemPriceRemoved: PlainDescriptor<Anonymize<Iafkqus0ohh6l6>>;
        /**
         * An item was bought.
         */
        ItemBought: PlainDescriptor<Anonymize<Iaii5qf41d5n3d>>;
        /**
         * A tip was sent.
         */
        TipSent: PlainDescriptor<Anonymize<Id9j7b85otvjru>>;
        /**
         * An `item` swap intent was created.
         */
        SwapCreated: PlainDescriptor<Anonymize<Iaihk9pek2ajl9>>;
        /**
         * The swap was cancelled.
         */
        SwapCancelled: PlainDescriptor<Anonymize<Iaihk9pek2ajl9>>;
        /**
         * The swap has been claimed.
         */
        SwapClaimed: PlainDescriptor<Anonymize<Id9av23h47ufb2>>;
        /**
         * New attributes have been set for an `item` of the `collection`.
         */
        PreSignedAttributesSet: PlainDescriptor<Anonymize<Ib4kpnijas4jqp>>;
        /**
         * A new attribute in the `Pallet` namespace was set for the `collection` or an `item`
         * within that `collection`.
         */
        PalletAttributeSet: PlainDescriptor<Anonymize<I2vnu5k0u1i65h>>;
    };
    NftFractionalization: {
        /**
         * An NFT was successfully fractionalized.
         */
        NftFractionalized: PlainDescriptor<Anonymize<Ib67harsthtcvr>>;
        /**
         * An NFT was successfully returned back.
         */
        NftUnified: PlainDescriptor<Anonymize<Ic7ok3lq0728f7>>;
    };
    TransactionStorage: {
        /**
         * Stored data under specified index.
         */
        Stored: PlainDescriptor<Anonymize<I66jdpl6lile9j>>;
        /**
         * Renewed data under specified index.
         */
        Renewed: PlainDescriptor<Anonymize<I66jdpl6lile9j>>;
        /**
         * Storage proof was successfully checked.
         */
        ProofChecked: PlainDescriptor<undefined>;
        /**
         * An account `who` was authorized to store `bytes` bytes in `transactions` transactions.
         */
        AccountAuthorized: PlainDescriptor<Anonymize<I2i8iea6e4ne1j>>;
        /**
         * An authorization for account `who` was refreshed.
         */
        AccountAuthorizationRefreshed: PlainDescriptor<Anonymize<I4cbvqmqadhrea>>;
        /**
         * Authorization was given for a preimage of `content_hash` (not exceeding `max_size`) to
         * be stored by anyone.
         */
        PreimageAuthorized: PlainDescriptor<Anonymize<I4jotama61aldv>>;
        /**
         * An authorization for a preimage of `content_hash` was refreshed.
         */
        PreimageAuthorizationRefreshed: PlainDescriptor<Anonymize<I3rfugj0vt1ug5>>;
        /**
         * An expired account authorization was removed.
         */
        ExpiredAccountAuthorizationRemoved: PlainDescriptor<Anonymize<I4cbvqmqadhrea>>;
        /**
         * An expired preimage authorization was removed.
         */
        ExpiredPreimageAuthorizationRemoved: PlainDescriptor<Anonymize<I3rfugj0vt1ug5>>;
    };
    VoterList: {
        /**
         * Moved an account from one bag to another.
         */
        Rebagged: PlainDescriptor<Anonymize<I37454vatvmm1l>>;
        /**
         * Updated the score of some account to the given amount.
         */
        ScoreUpdated: PlainDescriptor<Anonymize<Iblau1qa7u7fet>>;
    };
    ChildBounties: {
        /**
         * A child-bounty is added.
         */
        Added: PlainDescriptor<Anonymize<I60p8l86a8cm59>>;
        /**
         * A child-bounty is awarded to a beneficiary.
         */
        Awarded: PlainDescriptor<Anonymize<I3m3sk2lgcabvp>>;
        /**
         * A child-bounty is claimed by beneficiary.
         */
        Claimed: PlainDescriptor<Anonymize<I5pf572duh4oeg>>;
        /**
         * A child-bounty is cancelled.
         */
        Canceled: PlainDescriptor<Anonymize<I60p8l86a8cm59>>;
    };
    Remark: {
        /**
         * Stored data off chain.
         */
        Stored: PlainDescriptor<Anonymize<Icr6lg11cpe563>>;
    };
    NominationPools: {
        /**
         * A pool has been created.
         */
        Created: PlainDescriptor<Anonymize<I1ti389kf8t6oi>>;
        /**
         * A member has became bonded in a pool.
         */
        Bonded: PlainDescriptor<Anonymize<If4nnre373amul>>;
        /**
         * A payout has been made to a member.
         */
        PaidOut: PlainDescriptor<Anonymize<I55kbor0ocqk6h>>;
        /**
         * A member has unbonded from their pool.
         *
         * - `balance` is the corresponding balance of the number of points that has been
         * requested to be unbonded (the argument of the `unbond` transaction) from the bonded
         * pool.
         * - `points` is the number of points that are issued as a result of `balance` being
         * dissolved into the corresponding unbonding pool.
         * - `era` is the era in which the balance will be unbonded.
         * In the absence of slashing, these values will match. In the presence of slashing, the
         * number of points that are issued in the unbonding pool will be less than the amount
         * requested to be unbonded.
         */
        Unbonded: PlainDescriptor<Anonymize<Idsj9cg7j96kpc>>;
        /**
         * A member has withdrawn from their pool.
         *
         * The given number of `points` have been dissolved in return of `balance`.
         *
         * Similar to `Unbonded` event, in the absence of slashing, the ratio of point to balance
         * will be 1.
         */
        Withdrawn: PlainDescriptor<Anonymize<Ido4u9drncfaml>>;
        /**
         * A pool has been destroyed.
         */
        Destroyed: PlainDescriptor<Anonymize<I931cottvong90>>;
        /**
         * The state of a pool has changed
         */
        StateChanged: PlainDescriptor<Anonymize<Ie8c7ctks8ur2p>>;
        /**
         * A member has been removed from a pool.
         *
         * The removal can be voluntary (withdrawn all unbonded funds) or involuntary (kicked).
         * Any funds that are still delegated (i.e. dangling delegation) are released and are
         * represented by `released_balance`.
         */
        MemberRemoved: PlainDescriptor<Anonymize<I6c6fpqmnqijqd>>;
        /**
         * The roles of a pool have been updated to the given new roles. Note that the depositor
         * can never change.
         */
        RolesUpdated: PlainDescriptor<Anonymize<I6mik29s5073td>>;
        /**
         * The active balance of pool `pool_id` has been slashed to `balance`.
         */
        PoolSlashed: PlainDescriptor<Anonymize<I2m0sqmb75cnpb>>;
        /**
         * The unbond pool at `era` of pool `pool_id` has been slashed to `balance`.
         */
        UnbondingPoolSlashed: PlainDescriptor<Anonymize<I49agc5b62mehu>>;
        /**
         * A pool's commission setting has been changed.
         */
        PoolCommissionUpdated: PlainDescriptor<Anonymize<Iatq9jda4hq6pg>>;
        /**
         * A pool's maximum commission setting has been changed.
         */
        PoolMaxCommissionUpdated: PlainDescriptor<Anonymize<I8cbluptqo8kbp>>;
        /**
         * A pool's commission `change_rate` has been changed.
         */
        PoolCommissionChangeRateUpdated: PlainDescriptor<Anonymize<I81cc4plffa1dm>>;
        /**
         * Pool commission claim permission has been updated.
         */
        PoolCommissionClaimPermissionUpdated: PlainDescriptor<Anonymize<I3ihan8icf0c5k>>;
        /**
         * Pool commission has been claimed.
         */
        PoolCommissionClaimed: PlainDescriptor<Anonymize<I2g87evcjlgmqi>>;
        /**
         * Topped up deficit in frozen ED of the reward pool.
         */
        MinBalanceDeficitAdjusted: PlainDescriptor<Anonymize<Ieg1oc56mamrl5>>;
        /**
         * Claimed excess frozen ED of af the reward pool.
         */
        MinBalanceExcessAdjusted: PlainDescriptor<Anonymize<Ieg1oc56mamrl5>>;
        /**
         * A pool member's claim permission has been updated.
         */
        MemberClaimPermissionUpdated: PlainDescriptor<Anonymize<I93ajn7brqs8df>>;
        /**
         * A pool's metadata was updated.
         */
        MetadataUpdated: PlainDescriptor<Anonymize<Ib2q8vnsr19t9b>>;
        /**
         * A pool's nominating account (or the pool's root account) has nominated a validator set
         * on behalf of the pool.
         */
        PoolNominationMade: PlainDescriptor<Anonymize<Ib2q8vnsr19t9b>>;
        /**
         * The pool is chilled i.e. no longer nominating.
         */
        PoolNominatorChilled: PlainDescriptor<Anonymize<Ib2q8vnsr19t9b>>;
        /**
         * Global parameters regulating nomination pools have been updated.
         */
        GlobalParamsUpdated: PlainDescriptor<Anonymize<If6q1q7op2gvqf>>;
    };
    AssetConversion: {
        /**
         * A successful call of the `CreatePool` extrinsic will create this event.
         */
        PoolCreated: PlainDescriptor<Anonymize<I5okq99a5mhve0>>;
        /**
         * A pool's swap fee was set, either at creation via [`Pallet::create_pool_with_fee`]
         * or afterwards via [`Pallet::set_pool_fee`].
         */
        PoolFeeSet: PlainDescriptor<Anonymize<Ied3h58e6qlrmv>>;
        /**
         * A successful call of the `AddLiquidity` extrinsic will create this event.
         */
        LiquidityAdded: PlainDescriptor<Anonymize<Ibtl2buofcs39i>>;
        /**
         * A successful call of the `RemoveLiquidity` extrinsic will create this event.
         */
        LiquidityRemoved: PlainDescriptor<Anonymize<I359nvpbbb5v0e>>;
        /**
         * Assets have been converted from one to another. Both `SwapExactTokenForToken`
         * and `SwapTokenForExactToken` will generate this event.
         */
        SwapExecuted: PlainDescriptor<Anonymize<I8t31d95clla6j>>;
        /**
         * Assets have been converted from one to another.
         */
        SwapCreditExecuted: PlainDescriptor<Anonymize<Ifcsperb0j354i>>;
        /**
         * Pool has been touched in order to fulfill operational requirements.
         */
        Touched: PlainDescriptor<Anonymize<Ideuk4ni7h8umc>>;
    };
    FastUnstake: {
        /**
         * A staker was unstaked.
         */
        Unstaked: PlainDescriptor<Anonymize<I2amf0mdkaugme>>;
        /**
         * A staker was slashed for requesting fast-unstake whilst being exposed.
         */
        Slashed: PlainDescriptor<Anonymize<Ifk8eme5o7mukf>>;
        /**
         * A batch was partially checked for the given eras, but the process did not finish.
         */
        BatchChecked: PlainDescriptor<Anonymize<Ic0he9tlf9ll0u>>;
        /**
         * A batch of a given size was terminated.
         *
         * This is always follows by a number of `Unstaked` or `Slashed` events, marking the end
         * of the batch. A new batch will be created upon next block.
         */
        BatchFinished: PlainDescriptor<Anonymize<I54umskavgc9du>>;
        /**
         * An internal error happened. Operations will be paused now.
         */
        InternalError: PlainDescriptor<undefined>;
    };
    MessageQueue: {
        /**
         * Message discarded due to an error in the `MessageProcessor` (usually a format error).
         */
        ProcessingFailed: PlainDescriptor<Anonymize<Id77b899o0q565>>;
        /**
         * Message is processed.
         */
        Processed: PlainDescriptor<Anonymize<Iauaqn31cdv3v5>>;
        /**
         * Message placed in overweight queue.
         */
        OverweightEnqueued: PlainDescriptor<Anonymize<I132u4k70mlo2>>;
        /**
         * This page was reaped.
         */
        PageReaped: PlainDescriptor<Anonymize<I9a6c60esvi342>>;
    };
    TxPause: {
        /**
         * This pallet, or a specific call is now paused.
         */
        CallPaused: PlainDescriptor<Anonymize<Iba7pefg0d11kh>>;
        /**
         * This pallet, or a specific call is now unpaused.
         */
        CallUnpaused: PlainDescriptor<Anonymize<Iba7pefg0d11kh>>;
    };
    SafeMode: {
        /**
         * The safe-mode was entered until inclusively this block.
         */
        Entered: PlainDescriptor<Anonymize<I20e9ph536u7ti>>;
        /**
         * The safe-mode was extended until inclusively this block.
         */
        Extended: PlainDescriptor<Anonymize<I20e9ph536u7ti>>;
        /**
         * Exited the safe-mode for a specific reason.
         */
        Exited: PlainDescriptor<Anonymize<I8kcpmsh450rp>>;
        /**
         * An account reserved funds for either entering or extending the safe-mode.
         */
        DepositPlaced: PlainDescriptor<Anonymize<Ic262ibdoec56a>>;
        /**
         * An account had a reserve released that was reserved.
         */
        DepositReleased: PlainDescriptor<Anonymize<Ic262ibdoec56a>>;
        /**
         * An account had reserve slashed that was reserved.
         */
        DepositSlashed: PlainDescriptor<Anonymize<Ic262ibdoec56a>>;
        /**
         * Could not hold funds for entering or extending the safe-mode.
         *
         * This error comes from the underlying `Currency`.
         */
        CannotDeposit: PlainDescriptor<undefined>;
        /**
         * Could not release funds for entering or extending the safe-mode.
         *
         * This error comes from the underlying `Currency`.
         */
        CannotRelease: PlainDescriptor<undefined>;
    };
    Statement: {
        /**
         * A new statement is submitted
         */
        NewStatement: PlainDescriptor<Anonymize<I3ft01m2okqsq2>>;
    };
    MultiBlockMigrations: {
        /**
         * A Runtime upgrade started.
         *
         * Its end is indicated by `UpgradeCompleted` or `UpgradeFailed`.
         */
        UpgradeStarted: PlainDescriptor<Anonymize<If1co0pilmi7oq>>;
        /**
         * The current runtime upgrade completed.
         *
         * This implies that all of its migrations completed successfully as well.
         */
        UpgradeCompleted: PlainDescriptor<undefined>;
        /**
         * Runtime upgrade failed.
         *
         * This is very bad and will require governance intervention.
         */
        UpgradeFailed: PlainDescriptor<undefined>;
        /**
         * A migration was skipped since it was already executed in the past.
         */
        MigrationSkipped: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * A migration progressed.
         */
        MigrationAdvanced: PlainDescriptor<Anonymize<Iae74gjak1qibn>>;
        /**
         * A Migration completed.
         */
        MigrationCompleted: PlainDescriptor<Anonymize<Iae74gjak1qibn>>;
        /**
         * A Migration failed.
         *
         * This implies that the whole upgrade failed and governance intervention is required.
         */
        MigrationFailed: PlainDescriptor<Anonymize<Iae74gjak1qibn>>;
        /**
         * The set of historical migrations has been cleared.
         */
        HistoricCleared: PlainDescriptor<Anonymize<I3escdojpj0551>>;
    };
    Broker: {
        /**
         * A Region of Bulk Coretime has been purchased.
         */
        Purchased: PlainDescriptor<Anonymize<Iaf2rbm5li8ck4>>;
        /**
         * The workload of a core has become renewable.
         */
        Renewable: PlainDescriptor<Anonymize<Ib118uuss8au5p>>;
        /**
         * A workload has been renewed.
         */
        Renewed: PlainDescriptor<Anonymize<Idfdoi7vpo971s>>;
        /**
         * Ownership of a Region has been transferred.
         */
        Transferred: PlainDescriptor<Anonymize<Icjdv7ehtt4mjk>>;
        /**
         * A Region has been split into two non-overlapping Regions.
         */
        Partitioned: PlainDescriptor<Anonymize<I7fa966sr93enr>>;
        /**
         * A Region has been converted into two overlapping Regions each of lesser regularity.
         */
        Interlaced: PlainDescriptor<Anonymize<I7fa966sr93enr>>;
        /**
         * A Region has been assigned to a particular task.
         */
        Assigned: PlainDescriptor<Anonymize<Icinrphfs7c1gh>>;
        /**
         * An assignment has been removed from the workplan.
         */
        AssignmentRemoved: PlainDescriptor<Anonymize<I4s60s3v5pfj6u>>;
        /**
         * A Region has been added to the Instantaneous Coretime Pool.
         */
        Pooled: PlainDescriptor<Anonymize<Ib27rtfpnn4vta>>;
        /**
         * A new number of cores has been requested.
         */
        CoreCountRequested: PlainDescriptor<Anonymize<I629ak383ovl28>>;
        /**
         * The number of cores available for scheduling has changed.
         */
        CoreCountChanged: PlainDescriptor<Anonymize<I629ak383ovl28>>;
        /**
         * There is a new reservation for a workload.
         */
        ReservationMade: PlainDescriptor<Anonymize<If5j64blk6vsus>>;
        /**
         * A reservation for a workload has been cancelled.
         */
        ReservationCancelled: PlainDescriptor<Anonymize<If5j64blk6vsus>>;
        /**
         * A new sale has been initialized.
         */
        SaleInitialized: PlainDescriptor<Anonymize<Ich62oku3ck3iu>>;
        /**
         * A new lease has been created.
         */
        Leased: PlainDescriptor<Anonymize<I10gda06ia6n74>>;
        /**
         * A lease has been removed.
         */
        LeaseRemoved: PlainDescriptor<Anonymize<Ihqcf8k5b8c95>>;
        /**
         * A lease is about to end.
         */
        LeaseEnding: PlainDescriptor<Anonymize<Idj7j1g3t3rr57>>;
        /**
         * The sale rotation has been started and a new sale is imminent.
         */
        SalesStarted: PlainDescriptor<Anonymize<Ickukqupg34u5t>>;
        /**
         * The act of claiming revenue has begun.
         */
        RevenueClaimBegun: PlainDescriptor<Anonymize<I9l243q1j0e2us>>;
        /**
         * A particular timeslice has a non-zero claim.
         */
        RevenueClaimItem: PlainDescriptor<Anonymize<I44ckreh9i933v>>;
        /**
         * A revenue claim has (possibly only in part) been paid.
         */
        RevenueClaimPaid: PlainDescriptor<Anonymize<I2o3evaj5726u9>>;
        /**
         * Some Instantaneous Coretime Pool credit has been purchased.
         */
        CreditPurchased: PlainDescriptor<Anonymize<I201plm6irk5mk>>;
        /**
         * A Region has been dropped due to being out of date.
         */
        RegionDropped: PlainDescriptor<Anonymize<Ib27rtfpnn4vta>>;
        /**
         * Some historical Instantaneous Core Pool contribution record has been dropped.
         */
        ContributionDropped: PlainDescriptor<Anonymize<I4s60s3v5pfj6u>>;
        /**
         * A region has been force-removed from the pool. This is usually due to a provisionally
         * pooled region being redeployed.
         */
        RegionUnpooled: PlainDescriptor<Anonymize<Idmeitgo0fl3id>>;
        /**
         * Some historical Instantaneous Core Pool payment record has been initialized.
         */
        HistoryInitialized: PlainDescriptor<Anonymize<I7dkrdcvab1juf>>;
        /**
         * Some historical Instantaneous Core Pool payment record has been dropped.
         */
        HistoryDropped: PlainDescriptor<Anonymize<If5tfto9lepmm8>>;
        /**
         * Some historical Instantaneous Core Pool payment record has been ignored because the
         * timeslice was already known. Governance may need to intervene.
         */
        HistoryIgnored: PlainDescriptor<Anonymize<If5tfto9lepmm8>>;
        /**
         * Some historical Instantaneous Core Pool Revenue is ready for payout claims.
         */
        ClaimsReady: PlainDescriptor<Anonymize<Ifla9c8bp7r3l9>>;
        /**
         * A Core has been assigned to one or more tasks and/or the Pool on the Relay-chain.
         */
        CoreAssigned: PlainDescriptor<Anonymize<Im8dpq6bqg07f>>;
        /**
         * Some historical Instantaneous Core Pool payment record has been dropped.
         */
        PotentialRenewalDropped: PlainDescriptor<Anonymize<I3blejcb10m5c9>>;
        /**
        
         */
        AutoRenewalEnabled: PlainDescriptor<Anonymize<I6td68h84ru5u7>>;
        /**
        
         */
        AutoRenewalDisabled: PlainDescriptor<Anonymize<I6td68h84ru5u7>>;
        /**
         * Failed to auto-renew a core, likely due to the payer account not being sufficiently
         * funded.
         */
        AutoRenewalFailed: PlainDescriptor<Anonymize<I5mulkk8c7che3>>;
        /**
         * The auto-renewal limit has been reached upon renewing cores.
         *
         * This should never happen, given that enable_auto_renew checks for this before enabling
         * auto-renewal.
         */
        AutoRenewalLimitReached: PlainDescriptor<undefined>;
        /**
         * Failed to assign a force reservation due to no free cores available.
         */
        ForceReservationFailed: PlainDescriptor<Anonymize<I9cne53h7vg3o3>>;
        /**
         * Potential renewal was forcefully removed.
         */
        PotentialRenewalRemoved: PlainDescriptor<Anonymize<Id1mft8cuf1k15>>;
    };
    Parameters: {
        /**
         * A Parameter was set.
         *
         * Is also emitted when the value was not changed.
         */
        Updated: PlainDescriptor<Anonymize<I9hhtv8ta7cn20>>;
    };
    SkipFeelessPayment: {
        /**
         * A transaction fee was skipped.
         */
        FeeSkipped: PlainDescriptor<Anonymize<I86lj2lvai0jjp>>;
    };
    AssetConversionMigration: {
        /**
         * Indicates that a pool has been migrated to the new account ID.
         */
        MigratedToNewAccount: PlainDescriptor<Anonymize<I5i213pqldjng>>;
    };
    Revive: {
        /**
         * A custom event emitted by the contract.
         */
        ContractEmitted: PlainDescriptor<Anonymize<I7svbvm6hg57aj>>;
        /**
         * Contract deployed by deployer at the specified address.
         */
        Instantiated: PlainDescriptor<Anonymize<I8jhsbaiultviu>>;
        /**
         * Emitted when an Ethereum transaction reverts.
         *
         * Ethereum transactions always complete successfully at the extrinsic level,
         * as even reverted calls must store their `ReceiptInfo`.
         * To distinguish reverted calls from successful ones, this event is emitted
         * for failed Ethereum transactions.
         */
        EthExtrinsicRevert: PlainDescriptor<Anonymize<I920ueqv7have>>;
    };
    DelegatedStaking: {
        /**
         * Funds delegated by a delegator.
         */
        Delegated: PlainDescriptor<Anonymize<Id2aanom2jncf1>>;
        /**
         * Funds released to a delegator.
         */
        Released: PlainDescriptor<Anonymize<Id2aanom2jncf1>>;
        /**
         * Funds slashed from a delegator.
         */
        Slashed: PlainDescriptor<Anonymize<Id2aanom2jncf1>>;
        /**
         * Unclaimed delegation funds migrated to delegator.
         */
        MigratedDelegation: PlainDescriptor<Anonymize<Id2aanom2jncf1>>;
    };
    AssetsFreezer: {
        /**
        
         */
        Frozen: PlainDescriptor<Anonymize<Idusmq77988cmt>>;
        /**
        
         */
        Thawed: PlainDescriptor<Anonymize<Idusmq77988cmt>>;
    };
    Oracle: {
        /**
         * New data has been fed into the oracle.
         */
        NewFeedData: PlainDescriptor<Anonymize<Iae6ufqp41dfob>>;
    };
    MetaTx: {
        /**
         * A meta transaction has been dispatched.
         *
         * Contains the dispatch result of the meta transaction along with post-dispatch
         * information.
         */
        Dispatched: PlainDescriptor<Anonymize<I805fjumfh5lp2>>;
    };
    MultiAssetBounties: {
        /**
         * A new bounty was created and funding has been initiated.
         */
        BountyCreated: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
        /**
         * A new child-bounty was created and funding has been initiated.
         */
        ChildBountyCreated: PlainDescriptor<Anonymize<I60p8l86a8cm59>>;
        /**
         * The curator accepted role and child-/bounty became active.
         */
        BountyBecameActive: PlainDescriptor<Anonymize<I41bt7lr6c2cqa>>;
        /**
         * A child-/bounty was awarded to a beneficiary.
         */
        BountyAwarded: PlainDescriptor<Anonymize<Icp7uk05kec03m>>;
        /**
         * Payout payment to the beneficiary has concluded successfully.
         */
        BountyPayoutProcessed: PlainDescriptor<Anonymize<I18495m62cpsjo>>;
        /**
         * Funding payment has concluded successfully.
         */
        BountyFundingProcessed: PlainDescriptor<Anonymize<I1hl2lumftiuhm>>;
        /**
         * Refund payment has concluded successfully.
         */
        BountyRefundProcessed: PlainDescriptor<Anonymize<I1hl2lumftiuhm>>;
        /**
         * A child-/bounty was cancelled.
         */
        BountyCanceled: PlainDescriptor<Anonymize<I1hl2lumftiuhm>>;
        /**
         * A child-/bounty curator was unassigned.
         */
        CuratorUnassigned: PlainDescriptor<Anonymize<I1hl2lumftiuhm>>;
        /**
         * A child-/bounty curator was proposed.
         */
        CuratorProposed: PlainDescriptor<Anonymize<I41bt7lr6c2cqa>>;
        /**
         * A payment failed and can be retried.
         */
        PaymentFailed: PlainDescriptor<Anonymize<I1hl2lumftiuhm>>;
        /**
         * A payment happened and can be checked.
         */
        Paid: PlainDescriptor<Anonymize<I1hl2lumftiuhm>>;
        /**
         * A bounty's value was increased by its curator.
         */
        BountyValueIncreased: PlainDescriptor<Anonymize<I32klqpv3q0cp4>>;
    };
    RegistrarPara: {
        /**
         * A para id was reserved.
         */
        Reserved: PlainDescriptor<Anonymize<Idn2ghub1o4i40>>;
        /**
         * A registration was requested and the relay chain has been asked to accept it.
         */
        RegisterRequested: PlainDescriptor<Anonymize<Imk0evl51eusg>>;
        /**
         * The relay chain confirmed a registration.
         */
        Registered: PlainDescriptor<Anonymize<Imk0evl51eusg>>;
        /**
         * The relay chain rejected a registration. The registration consideration was returned.
         */
        RegistrationFailed: PlainDescriptor<Anonymize<Iehnbl33s6kgkm>>;
        /**
         * A manager gave up on a pending registration, and the relay chain has been asked to
         * drop the authorization. The consideration stays taken until it answers.
         */
        CancelRequested: PlainDescriptor<Anonymize<Imk0evl51eusg>>;
        /**
         * The relay chain confirmed a cancellation. The registration consideration was returned.
         */
        RegistrationCancelled: PlainDescriptor<Anonymize<Imk0evl51eusg>>;
    };
    RegistrarRelay: {
        /**
         * A registration request was accepted and is waiting on its validation code.
         */
        RegistrationPending: PlainDescriptor<Anonymize<Iej1vlcdhgkpe>>;
        /**
         * A registration request was rejected out of hand.
         */
        RegistrationRejected: PlainDescriptor<Anonymize<Ibon7bp75ufg1e>>;
        /**
         * A para was onboarded.
         */
        Registered: PlainDescriptor<Anonymize<Imk0evl51eusg>>;
        /**
         * An authorization was dropped at the parachain's request.
         */
        AuthorizationCancelled: PlainDescriptor<Anonymize<Iatlpqusbd4df2>>;
        /**
         * A cancellation arrived after the para had already been onboarded, and was refused.
         */
        CancellationRefused: PlainDescriptor<Anonymize<Iatlpqusbd4df2>>;
        /**
         * A report could not be sent back to the parachain.
         *
         * The relay chain's own state is already correct; the parachain is now out of step and
         * will need its manager to ask again.
         */
        ReportFailed: PlainDescriptor<Anonymize<Iatlpqusbd4df2>>;
    };
};
type IError = {
    System: {
        /**
         * The name of specification does not match between the current runtime
         * and the new runtime.
         */
        InvalidSpecName: PlainDescriptor<undefined>;
        /**
         * The specification version is not allowed to decrease between the current runtime
         * and the new runtime.
         */
        SpecVersionNeedsToIncrease: PlainDescriptor<undefined>;
        /**
         * Failed to extract the runtime version from the new runtime.
         *
         * Either calling `Core_version` or decoding `RuntimeVersion` failed.
         */
        FailedToExtractRuntimeVersion: PlainDescriptor<undefined>;
        /**
         * Suicide called when the account has non-default composite data.
         */
        NonDefaultComposite: PlainDescriptor<undefined>;
        /**
         * There is a non-zero reference count preventing the account from being purged.
         */
        NonZeroRefCount: PlainDescriptor<undefined>;
        /**
         * The origin filter prevent the call to be dispatched.
         */
        CallFiltered: PlainDescriptor<undefined>;
        /**
         * A multi-block migration is ongoing and prevents the current code from being replaced.
         */
        MultiBlockMigrationsOngoing: PlainDescriptor<undefined>;
        /**
         * No upgrade authorized.
         */
        NothingAuthorized: PlainDescriptor<undefined>;
        /**
         * The submitted code is not authorized.
         */
        Unauthorized: PlainDescriptor<undefined>;
    };
    Utility: {
        /**
         * Too many calls batched.
         */
        TooManyCalls: PlainDescriptor<undefined>;
    };
    Babe: {
        /**
         * An equivocation proof provided as part of an equivocation report is invalid.
         */
        InvalidEquivocationProof: PlainDescriptor<undefined>;
        /**
         * A key ownership proof provided as part of an equivocation report is invalid.
         */
        InvalidKeyOwnershipProof: PlainDescriptor<undefined>;
        /**
         * A given equivocation report is valid but already previously reported.
         */
        DuplicateOffenceReport: PlainDescriptor<undefined>;
        /**
         * Submitted configuration is invalid.
         */
        InvalidConfiguration: PlainDescriptor<undefined>;
    };
    Indices: {
        /**
         * The index was not already assigned.
         */
        NotAssigned: PlainDescriptor<undefined>;
        /**
         * The index is assigned to another account.
         */
        NotOwner: PlainDescriptor<undefined>;
        /**
         * The index was not available.
         */
        InUse: PlainDescriptor<undefined>;
        /**
         * The source and destination accounts are identical.
         */
        NotTransfer: PlainDescriptor<undefined>;
        /**
         * The index is permanent and may not be freed/changed.
         */
        Permanent: PlainDescriptor<undefined>;
    };
    Balances: {
        /**
         * Vesting balance too high to send value.
         */
        VestingBalance: PlainDescriptor<undefined>;
        /**
         * Account liquidity restrictions prevent withdrawal.
         */
        LiquidityRestrictions: PlainDescriptor<undefined>;
        /**
         * Balance too low to send value.
         */
        InsufficientBalance: PlainDescriptor<undefined>;
        /**
         * Value too low to create account due to existential deposit.
         */
        ExistentialDeposit: PlainDescriptor<undefined>;
        /**
         * Transfer/payment would kill account.
         */
        Expendability: PlainDescriptor<undefined>;
        /**
         * A vesting schedule already exists for this account.
         */
        ExistingVestingSchedule: PlainDescriptor<undefined>;
        /**
         * Beneficiary account must pre-exist.
         */
        DeadAccount: PlainDescriptor<undefined>;
        /**
         * Number of named reserves exceed `MaxReserves`.
         */
        TooManyReserves: PlainDescriptor<undefined>;
        /**
         * Number of holds exceed `VariantCountOf<T::RuntimeHoldReason>`.
         */
        TooManyHolds: PlainDescriptor<undefined>;
        /**
         * Number of freezes exceed `MaxFreezes`.
         */
        TooManyFreezes: PlainDescriptor<undefined>;
        /**
         * The issuance cannot be modified since it is already deactivated.
         */
        IssuanceDeactivated: PlainDescriptor<undefined>;
        /**
         * The delta cannot be zero.
         */
        DeltaZero: PlainDescriptor<undefined>;
    };
    ElectionProviderMultiPhase: {
        /**
         * Submission was too early.
         */
        PreDispatchEarlySubmission: PlainDescriptor<undefined>;
        /**
         * Wrong number of winners presented.
         */
        PreDispatchWrongWinnerCount: PlainDescriptor<undefined>;
        /**
         * Submission was too weak, score-wise.
         */
        PreDispatchWeakSubmission: PlainDescriptor<undefined>;
        /**
         * The queue was full, and the solution was not better than any of the existing ones.
         */
        SignedQueueFull: PlainDescriptor<undefined>;
        /**
         * The origin failed to pay the deposit.
         */
        SignedCannotPayDeposit: PlainDescriptor<undefined>;
        /**
         * Witness data to dispatchable is invalid.
         */
        SignedInvalidWitness: PlainDescriptor<undefined>;
        /**
         * The signed submission consumes too much weight
         */
        SignedTooMuchWeight: PlainDescriptor<undefined>;
        /**
         * OCW submitted solution for wrong round
         */
        OcwCallWrongEra: PlainDescriptor<undefined>;
        /**
         * Snapshot metadata should exist but didn't.
         */
        MissingSnapshotMetadata: PlainDescriptor<undefined>;
        /**
         * `Self::insert_submission` returned an invalid index.
         */
        InvalidSubmissionIndex: PlainDescriptor<undefined>;
        /**
         * The call is not allowed at this point.
         */
        CallNotAllowed: PlainDescriptor<undefined>;
        /**
         * The fallback failed
         */
        FallbackFailed: PlainDescriptor<undefined>;
        /**
         * Some bound not met
         */
        BoundNotMet: PlainDescriptor<undefined>;
        /**
         * Submitted solution has too many winners
         */
        TooManyWinners: PlainDescriptor<undefined>;
        /**
         * Submission was prepared for a different round.
         */
        PreDispatchDifferentRound: PlainDescriptor<undefined>;
    };
    Staking: {
        /**
         * Not a controller account.
         */
        NotController: PlainDescriptor<undefined>;
        /**
         * Not a stash account.
         */
        NotStash: PlainDescriptor<undefined>;
        /**
         * Stash is already bonded.
         */
        AlreadyBonded: PlainDescriptor<undefined>;
        /**
         * Controller is already paired.
         */
        AlreadyPaired: PlainDescriptor<undefined>;
        /**
         * Targets cannot be empty.
         */
        EmptyTargets: PlainDescriptor<undefined>;
        /**
         * Duplicate index.
         */
        DuplicateIndex: PlainDescriptor<undefined>;
        /**
         * Slash record index out of bounds.
         */
        InvalidSlashIndex: PlainDescriptor<undefined>;
        /**
         * Cannot have a validator or nominator role, with value less than the minimum defined by
         * governance (see `MinValidatorBond` and `MinNominatorBond`). If unbonding is the
         * intention, `chill` first to remove one's role as validator/nominator.
         */
        InsufficientBond: PlainDescriptor<undefined>;
        /**
         * Can not schedule more unlock chunks.
         */
        NoMoreChunks: PlainDescriptor<undefined>;
        /**
         * Can not rebond without unlocking chunks.
         */
        NoUnlockChunk: PlainDescriptor<undefined>;
        /**
         * Attempting to target a stash that still has funds.
         */
        FundedTarget: PlainDescriptor<undefined>;
        /**
         * Invalid era to reward.
         */
        InvalidEraToReward: PlainDescriptor<undefined>;
        /**
         * Invalid number of nominations.
         */
        InvalidNumberOfNominations: PlainDescriptor<undefined>;
        /**
         * Items are not sorted and unique.
         */
        NotSortedAndUnique: PlainDescriptor<undefined>;
        /**
         * Rewards for this era have already been claimed for this validator.
         */
        AlreadyClaimed: PlainDescriptor<undefined>;
        /**
         * No nominators exist on this page.
         */
        InvalidPage: PlainDescriptor<undefined>;
        /**
         * Incorrect previous history depth input provided.
         */
        IncorrectHistoryDepth: PlainDescriptor<undefined>;
        /**
         * Incorrect number of slashing spans provided.
         */
        IncorrectSlashingSpans: PlainDescriptor<undefined>;
        /**
         * Internal state has become somehow corrupted and the operation cannot continue.
         */
        BadState: PlainDescriptor<undefined>;
        /**
         * Too many nomination targets supplied.
         */
        TooManyTargets: PlainDescriptor<undefined>;
        /**
         * A nomination target was supplied that was blocked or otherwise not a validator.
         */
        BadTarget: PlainDescriptor<undefined>;
        /**
         * The user has enough bond and thus cannot be chilled forcefully by an external person.
         */
        CannotChillOther: PlainDescriptor<undefined>;
        /**
         * There are too many nominators in the system. Governance needs to adjust the staking
         * settings to keep things safe for the runtime.
         */
        TooManyNominators: PlainDescriptor<undefined>;
        /**
         * There are too many validator candidates in the system. Governance needs to adjust the
         * staking settings to keep things safe for the runtime.
         */
        TooManyValidators: PlainDescriptor<undefined>;
        /**
         * Commission is too low. Must be at least `MinCommission`.
         */
        CommissionTooLow: PlainDescriptor<undefined>;
        /**
         * Some bound is not met.
         */
        BoundNotMet: PlainDescriptor<undefined>;
        /**
         * Used when attempting to use deprecated controller account logic.
         */
        ControllerDeprecated: PlainDescriptor<undefined>;
        /**
         * Cannot reset a ledger.
         */
        CannotRestoreLedger: PlainDescriptor<undefined>;
        /**
         * Provided reward destination is not allowed.
         */
        RewardDestinationRestricted: PlainDescriptor<undefined>;
        /**
         * Not enough funds available to withdraw.
         */
        NotEnoughFunds: PlainDescriptor<undefined>;
        /**
         * Operation not allowed for virtual stakers.
         */
        VirtualStakerNotAllowed: PlainDescriptor<undefined>;
        /**
         * Stash could not be reaped as other pallet might depend on it.
         */
        CannotReapStash: PlainDescriptor<undefined>;
        /**
         * The stake of this account is already migrated to `Fungible` holds.
         */
        AlreadyMigrated: PlainDescriptor<undefined>;
        /**
         * Account is restricted from participation in staking. This may happen if the account is
         * staking in another way already, such as via pool.
         */
        Restricted: PlainDescriptor<undefined>;
    };
    Session: {
        /**
         * Invalid ownership proof.
         */
        InvalidProof: PlainDescriptor<undefined>;
        /**
         * No associated validator ID for account.
         */
        NoAssociatedValidatorId: PlainDescriptor<undefined>;
        /**
         * Registered duplicate key.
         */
        DuplicatedKey: PlainDescriptor<undefined>;
        /**
         * No keys are associated with this account.
         */
        NoKeys: PlainDescriptor<undefined>;
        /**
         * Key setting account is not live, so it's impossible to associate keys.
         */
        NoAccount: PlainDescriptor<undefined>;
    };
    TechnicalCommittee: {
        /**
         * Account is not a member
         */
        NotMember: PlainDescriptor<undefined>;
        /**
         * Duplicate proposals not allowed
         */
        DuplicateProposal: PlainDescriptor<undefined>;
        /**
         * Proposal must exist
         */
        ProposalMissing: PlainDescriptor<undefined>;
        /**
         * Mismatched index
         */
        WrongIndex: PlainDescriptor<undefined>;
        /**
         * Duplicate vote ignored
         */
        DuplicateVote: PlainDescriptor<undefined>;
        /**
         * Members are already initialized!
         */
        AlreadyInitialized: PlainDescriptor<undefined>;
        /**
         * The close call was made too early, before the end of the voting.
         */
        TooEarly: PlainDescriptor<undefined>;
        /**
         * There can only be a maximum of `MaxProposals` active proposals.
         */
        TooManyProposals: PlainDescriptor<undefined>;
        /**
         * The given weight bound for the proposal was too low.
         */
        WrongProposalWeight: PlainDescriptor<undefined>;
        /**
         * The given length bound for the proposal was too low.
         */
        WrongProposalLength: PlainDescriptor<undefined>;
        /**
         * Prime account is not a member
         */
        PrimeAccountNotMember: PlainDescriptor<undefined>;
        /**
         * Proposal is still active.
         */
        ProposalActive: PlainDescriptor<undefined>;
    };
    TechnicalMembership: {
        /**
         * Already a member.
         */
        AlreadyMember: PlainDescriptor<undefined>;
        /**
         * Not a member.
         */
        NotMember: PlainDescriptor<undefined>;
        /**
         * Too many members.
         */
        TooManyMembers: PlainDescriptor<undefined>;
    };
    Grandpa: {
        /**
         * Attempt to signal GRANDPA pause when the authority set isn't live
         * (either paused or already pending pause).
         */
        PauseFailed: PlainDescriptor<undefined>;
        /**
         * Attempt to signal GRANDPA resume when the authority set isn't paused
         * (either live or already pending resume).
         */
        ResumeFailed: PlainDescriptor<undefined>;
        /**
         * Attempt to signal GRANDPA change with one already pending.
         */
        ChangePending: PlainDescriptor<undefined>;
        /**
         * Cannot signal forced change so soon after last.
         */
        TooSoon: PlainDescriptor<undefined>;
        /**
         * A key ownership proof provided as part of an equivocation report is invalid.
         */
        InvalidKeyOwnershipProof: PlainDescriptor<undefined>;
        /**
         * An equivocation proof provided as part of an equivocation report is invalid.
         */
        InvalidEquivocationProof: PlainDescriptor<undefined>;
        /**
         * A given equivocation report is valid but already previously reported.
         */
        DuplicateOffenceReport: PlainDescriptor<undefined>;
    };
    Treasury: {
        /**
         * No proposal, bounty or spend at that index.
         */
        InvalidIndex: PlainDescriptor<undefined>;
        /**
         * Too many approvals in the queue.
         */
        TooManyApprovals: PlainDescriptor<undefined>;
        /**
         * The spend origin is valid but the amount it is allowed to spend is lower than the
         * amount to be spent.
         */
        InsufficientPermission: PlainDescriptor<undefined>;
        /**
         * Proposal has not been approved.
         */
        ProposalNotApproved: PlainDescriptor<undefined>;
        /**
         * The balance of the asset kind is not convertible to the balance of the native asset.
         */
        FailedToConvertBalance: PlainDescriptor<undefined>;
        /**
         * The spend has expired and cannot be claimed.
         */
        SpendExpired: PlainDescriptor<undefined>;
        /**
         * The spend is not yet eligible for payout.
         */
        EarlyPayout: PlainDescriptor<undefined>;
        /**
         * The payment has already been attempted.
         */
        AlreadyAttempted: PlainDescriptor<undefined>;
        /**
         * There was some issue with the mechanism of payment.
         */
        PayoutError: PlainDescriptor<undefined>;
        /**
         * The payout was not yet attempted/claimed.
         */
        NotAttempted: PlainDescriptor<undefined>;
        /**
         * The payment has neither failed nor succeeded yet.
         */
        Inconclusive: PlainDescriptor<undefined>;
    };
    AssetRate: {
        /**
         * The given asset ID is unknown.
         */
        UnknownAssetKind: PlainDescriptor<undefined>;
        /**
         * The given asset ID already has an assigned conversion rate and cannot be re-created.
         */
        AlreadyExists: PlainDescriptor<undefined>;
        /**
         * Overflow ocurred when calculating the inverse rate.
         */
        Overflow: PlainDescriptor<undefined>;
    };
    Contracts: {
        /**
         * Invalid schedule supplied, e.g. with zero weight of a basic operation.
         */
        InvalidSchedule: PlainDescriptor<undefined>;
        /**
         * Invalid combination of flags supplied to `seal_call` or `seal_delegate_call`.
         */
        InvalidCallFlags: PlainDescriptor<undefined>;
        /**
         * The executed contract exhausted its gas limit.
         */
        OutOfGas: PlainDescriptor<undefined>;
        /**
         * The output buffer supplied to a contract API call was too small.
         */
        OutputBufferTooSmall: PlainDescriptor<undefined>;
        /**
         * Performing the requested transfer failed. Probably because there isn't enough
         * free balance in the sender's account.
         */
        TransferFailed: PlainDescriptor<undefined>;
        /**
         * Performing a call was denied because the calling depth reached the limit
         * of what is specified in the schedule.
         */
        MaxCallDepthReached: PlainDescriptor<undefined>;
        /**
         * No contract was found at the specified address.
         */
        ContractNotFound: PlainDescriptor<undefined>;
        /**
         * The code supplied to `instantiate_with_code` exceeds the limit specified in the
         * current schedule.
         */
        CodeTooLarge: PlainDescriptor<undefined>;
        /**
         * No code could be found at the supplied code hash.
         */
        CodeNotFound: PlainDescriptor<undefined>;
        /**
         * No code info could be found at the supplied code hash.
         */
        CodeInfoNotFound: PlainDescriptor<undefined>;
        /**
         * A buffer outside of sandbox memory was passed to a contract API function.
         */
        OutOfBounds: PlainDescriptor<undefined>;
        /**
         * Input passed to a contract API function failed to decode as expected type.
         */
        DecodingFailed: PlainDescriptor<undefined>;
        /**
         * Contract trapped during execution.
         */
        ContractTrapped: PlainDescriptor<undefined>;
        /**
         * The size defined in `T::MaxValueSize` was exceeded.
         */
        ValueTooLarge: PlainDescriptor<undefined>;
        /**
         * Termination of a contract is not allowed while the contract is already
         * on the call stack. Can be triggered by `seal_terminate`.
         */
        TerminatedWhileReentrant: PlainDescriptor<undefined>;
        /**
         * `seal_call` forwarded this contracts input. It therefore is no longer available.
         */
        InputForwarded: PlainDescriptor<undefined>;
        /**
         * The subject passed to `seal_random` exceeds the limit.
         */
        RandomSubjectTooLong: PlainDescriptor<undefined>;
        /**
         * The amount of topics passed to `seal_deposit_events` exceeds the limit.
         */
        TooManyTopics: PlainDescriptor<undefined>;
        /**
         * The chain does not provide a chain extension. Calling the chain extension results
         * in this error. Note that this usually  shouldn't happen as deploying such contracts
         * is rejected.
         */
        NoChainExtension: PlainDescriptor<undefined>;
        /**
         * Failed to decode the XCM program.
         */
        XCMDecodeFailed: PlainDescriptor<undefined>;
        /**
         * A contract with the same AccountId already exists.
         */
        DuplicateContract: PlainDescriptor<undefined>;
        /**
         * A contract self destructed in its constructor.
         *
         * This can be triggered by a call to `seal_terminate`.
         */
        TerminatedInConstructor: PlainDescriptor<undefined>;
        /**
         * A call tried to invoke a contract that is flagged as non-reentrant.
         * The only other cause is that a call from a contract into the runtime tried to call back
         * into `pallet-contracts`. This would make the whole pallet reentrant with regard to
         * contract code execution which is not supported.
         */
        ReentranceDenied: PlainDescriptor<undefined>;
        /**
         * A contract attempted to invoke a state modifying API while being in read-only mode.
         */
        StateChangeDenied: PlainDescriptor<undefined>;
        /**
         * Origin doesn't have enough balance to pay the required storage deposits.
         */
        StorageDepositNotEnoughFunds: PlainDescriptor<undefined>;
        /**
         * More storage was created than allowed by the storage deposit limit.
         */
        StorageDepositLimitExhausted: PlainDescriptor<undefined>;
        /**
         * Code removal was denied because the code is still in use by at least one contract.
         */
        CodeInUse: PlainDescriptor<undefined>;
        /**
         * The contract ran to completion but decided to revert its storage changes.
         * Please note that this error is only returned from extrinsics. When called directly
         * or via RPC an `Ok` will be returned. In this case the caller needs to inspect the flags
         * to determine whether a reversion has taken place.
         */
        ContractReverted: PlainDescriptor<undefined>;
        /**
         * The contract's code was found to be invalid during validation.
         *
         * The most likely cause of this is that an API was used which is not supported by the
         * node. This happens if an older node is used with a new version of ink!. Try updating
         * your node to the newest available version.
         *
         * A more detailed error can be found on the node console if debug messages are enabled
         * by supplying `-lruntime::contracts=debug`.
         */
        CodeRejected: PlainDescriptor<undefined>;
        /**
         * An indeterministic code was used in a context where this is not permitted.
         */
        Indeterministic: PlainDescriptor<undefined>;
        /**
         * A pending migration needs to complete before the extrinsic can be called.
         */
        MigrationInProgress: PlainDescriptor<undefined>;
        /**
         * Migrate dispatch call was attempted but no migration was performed.
         */
        NoMigrationPerformed: PlainDescriptor<undefined>;
        /**
         * The contract has reached its maximum number of delegate dependencies.
         */
        MaxDelegateDependenciesReached: PlainDescriptor<undefined>;
        /**
         * The dependency was not found in the contract's delegate dependencies.
         */
        DelegateDependencyNotFound: PlainDescriptor<undefined>;
        /**
         * The contract already depends on the given delegate dependency.
         */
        DelegateDependencyAlreadyExists: PlainDescriptor<undefined>;
        /**
         * Can not add a delegate dependency to the code hash of the contract itself.
         */
        CannotAddSelfAsDelegateDependency: PlainDescriptor<undefined>;
        /**
         * Can not add more data to transient storage.
         */
        OutOfTransientStorage: PlainDescriptor<undefined>;
    };
    Sudo: {
        /**
         * Sender must be the Sudo account.
         */
        RequireSudo: PlainDescriptor<undefined>;
    };
    ImOnline: {
        /**
         * Non existent public key.
         */
        InvalidKey: PlainDescriptor<undefined>;
        /**
         * Duplicated heartbeat.
         */
        DuplicatedHeartbeat: PlainDescriptor<undefined>;
    };
    Identity: {
        /**
         * Too many subs-accounts.
         */
        TooManySubAccounts: PlainDescriptor<undefined>;
        /**
         * Account isn't found.
         */
        NotFound: PlainDescriptor<undefined>;
        /**
         * Account isn't named.
         */
        NotNamed: PlainDescriptor<undefined>;
        /**
         * Empty index.
         */
        EmptyIndex: PlainDescriptor<undefined>;
        /**
         * Fee is changed.
         */
        FeeChanged: PlainDescriptor<undefined>;
        /**
         * No identity found.
         */
        NoIdentity: PlainDescriptor<undefined>;
        /**
         * Sticky judgement.
         */
        StickyJudgement: PlainDescriptor<undefined>;
        /**
         * Judgement given.
         */
        JudgementGiven: PlainDescriptor<undefined>;
        /**
         * Invalid judgement.
         */
        InvalidJudgement: PlainDescriptor<undefined>;
        /**
         * The index is invalid.
         */
        InvalidIndex: PlainDescriptor<undefined>;
        /**
         * The target is invalid.
         */
        InvalidTarget: PlainDescriptor<undefined>;
        /**
         * Maximum amount of registrars reached. Cannot add any more.
         */
        TooManyRegistrars: PlainDescriptor<undefined>;
        /**
         * Account ID is already named.
         */
        AlreadyClaimed: PlainDescriptor<undefined>;
        /**
         * Sender is not a sub-account.
         */
        NotSub: PlainDescriptor<undefined>;
        /**
         * Sub-account isn't owned by sender.
         */
        NotOwned: PlainDescriptor<undefined>;
        /**
         * The provided judgement was for a different identity.
         */
        JudgementForDifferentIdentity: PlainDescriptor<undefined>;
        /**
         * Error that occurs when there is an issue paying for judgement.
         */
        JudgementPaymentFailed: PlainDescriptor<undefined>;
        /**
         * The provided suffix is too long.
         */
        InvalidSuffix: PlainDescriptor<undefined>;
        /**
         * The sender does not have permission to issue a username.
         */
        NotUsernameAuthority: PlainDescriptor<undefined>;
        /**
         * The authority cannot allocate any more usernames.
         */
        NoAllocation: PlainDescriptor<undefined>;
        /**
         * The signature on a username was not valid.
         */
        InvalidSignature: PlainDescriptor<undefined>;
        /**
         * Setting this username requires a signature, but none was provided.
         */
        RequiresSignature: PlainDescriptor<undefined>;
        /**
         * The username does not meet the requirements.
         */
        InvalidUsername: PlainDescriptor<undefined>;
        /**
         * The username is already taken.
         */
        UsernameTaken: PlainDescriptor<undefined>;
        /**
         * The requested username does not exist.
         */
        NoUsername: PlainDescriptor<undefined>;
        /**
         * The username cannot be forcefully removed because it can still be accepted.
         */
        NotExpired: PlainDescriptor<undefined>;
        /**
         * The username cannot be removed because it's still in the grace period.
         */
        TooEarly: PlainDescriptor<undefined>;
        /**
         * The username cannot be removed because it is not unbinding.
         */
        NotUnbinding: PlainDescriptor<undefined>;
        /**
         * The username cannot be unbound because it is already unbinding.
         */
        AlreadyUnbinding: PlainDescriptor<undefined>;
        /**
         * The action cannot be performed because of insufficient privileges (e.g. authority
         * trying to unbind a username provided by the system).
         */
        InsufficientPrivileges: PlainDescriptor<undefined>;
    };
    Recovery: {
        /**
         * This attempt is already fully approved and does not need any more votes.
         */
        AlreadyApproved: PlainDescriptor<undefined>;
        /**
         * The recovery attempt has already been initiated.
         */
        AlreadyInitiated: PlainDescriptor<undefined>;
        /**
         * The friend already voted for this attempt.
         */
        AlreadyVoted: PlainDescriptor<undefined>;
        /**
         * The lost account has ongoing recovery attempts.
         */
        HasOngoingAttempts: PlainDescriptor<undefined>;
        /**
         * The lost account cannot be a friend of itself.
         */
        LostAccountInFriendGroup: PlainDescriptor<undefined>;
        /**
         * The account was already recovered by a group of equal or higher priority.
         */
        HigherPriorityRecovered: PlainDescriptor<undefined>;
        /**
         * Cancel delay must be at least 1.
         */
        NoCancelDelay: PlainDescriptor<undefined>;
        /**
         * This account does not have any friend groups.
         */
        NoFriendGroups: PlainDescriptor<undefined>;
        /**
         * The friend group has no friends.
         */
        NoFriends: PlainDescriptor<undefined>;
        /**
         * The lost account does not have any inheritor.
         */
        NoInheritor: PlainDescriptor<undefined>;
        /**
         * Not enough friends approved this attempt.
         */
        NotApproved: PlainDescriptor<undefined>;
        /**
         * The referenced recovery attempt was not found.
         */
        NotAttempt: PlainDescriptor<undefined>;
        /**
         * The caller is not the initiator or the lost account.
         */
        NotCanceller: PlainDescriptor<undefined>;
        /**
         * The caller is not a friend of the lost account.
         */
        NotFriend: PlainDescriptor<undefined>;
        /**
         * A specific referenced friend group was not found.
         */
        NotFriendGroup: PlainDescriptor<undefined>;
        /**
         * The caller is not the inheritor of the lost account.
         */
        NotInheritor: PlainDescriptor<undefined>;
        /**
         * The cancel delay since the last approval or initialization has not yet passed.
         */
        NotYetCancelable: PlainDescriptor<undefined>;
        /**
         * The inheritance delay of this attempt has not yet passed.
         */
        NotYetInheritable: PlainDescriptor<undefined>;
        /**
         * Too many friend groups.
         */
        TooManyFriendGroups: PlainDescriptor<undefined>;
        /**
         * The number of friends needed is greater than the number of friends.
         */
        TooManyFriendsNeeded: PlainDescriptor<undefined>;
        /**
         * The number of friends needed is zero.
         */
        NoFriendsNeeded: PlainDescriptor<undefined>;
        /**
         * The friends of a friend group are not sorted or not unique.
         */
        FriendsNotSortedOrUnique: PlainDescriptor<undefined>;
        /**
         * Two friend groups have the same set of friends.
         */
        DuplicateFriendGroups: PlainDescriptor<undefined>;
    };
    Vesting: {
        /**
         * The account given is not vesting.
         */
        NotVesting: PlainDescriptor<undefined>;
        /**
         * The account already has `MaxVestingSchedules` count of schedules and thus
         * cannot add another one. Consider merging existing schedules in order to add another.
         */
        AtMaxVestingSchedules: PlainDescriptor<undefined>;
        /**
         * Amount being transferred is too low to create a vesting schedule.
         */
        AmountLow: PlainDescriptor<undefined>;
        /**
         * An index was out of bounds of the vesting schedules.
         */
        ScheduleIndexOutOfBounds: PlainDescriptor<undefined>;
        /**
         * Failed to create a new schedule because some parameter was invalid.
         */
        InvalidScheduleParams: PlainDescriptor<undefined>;
    };
    Scheduler: {
        /**
         * Failed to schedule a call
         */
        FailedToSchedule: PlainDescriptor<undefined>;
        /**
         * Cannot find the scheduled call.
         */
        NotFound: PlainDescriptor<undefined>;
        /**
         * Given target block number is in the past.
         */
        TargetBlockNumberInPast: PlainDescriptor<undefined>;
        /**
         * Reschedule failed because it does not change scheduled time.
         */
        RescheduleNoChange: PlainDescriptor<undefined>;
        /**
         * Attempt to use a non-named function on a named task.
         */
        Named: PlainDescriptor<undefined>;
    };
    Preimage: {
        /**
         * Preimage is too large to store on-chain.
         */
        TooBig: PlainDescriptor<undefined>;
        /**
         * Preimage has already been noted on-chain.
         */
        AlreadyNoted: PlainDescriptor<undefined>;
        /**
         * The user is not authorized to perform this action.
         */
        NotAuthorized: PlainDescriptor<undefined>;
        /**
         * The preimage cannot be removed since it has not yet been noted.
         */
        NotNoted: PlainDescriptor<undefined>;
        /**
         * A preimage may not be removed when there are outstanding requests.
         */
        Requested: PlainDescriptor<undefined>;
        /**
         * The preimage request cannot be removed since no outstanding requests exist.
         */
        NotRequested: PlainDescriptor<undefined>;
        /**
         * More than `MAX_HASH_UPGRADE_BULK_COUNT` hashes were requested to be upgraded at once.
         */
        TooMany: PlainDescriptor<undefined>;
        /**
         * Too few hashes were requested to be upgraded (i.e. zero).
         */
        TooFew: PlainDescriptor<undefined>;
    };
    Proxy: {
        /**
         * There are too many proxies registered or too many announcements pending.
         */
        TooMany: PlainDescriptor<undefined>;
        /**
         * Proxy registration not found.
         */
        NotFound: PlainDescriptor<undefined>;
        /**
         * Sender is not a proxy of the account to be proxied.
         */
        NotProxy: PlainDescriptor<undefined>;
        /**
         * A call which is incompatible with the proxy type's filter was attempted.
         */
        Unproxyable: PlainDescriptor<undefined>;
        /**
         * Account is already a proxy.
         */
        Duplicate: PlainDescriptor<undefined>;
        /**
         * Call may not be made by proxy because it may escalate its privileges.
         */
        NoPermission: PlainDescriptor<undefined>;
        /**
         * Announcement, if made at all, was made too recently.
         */
        Unannounced: PlainDescriptor<undefined>;
        /**
         * Cannot add self as proxy.
         */
        NoSelfProxy: PlainDescriptor<undefined>;
    };
    Multisig: {
        /**
         * Threshold must be 2 or greater.
         */
        MinimumThreshold: PlainDescriptor<undefined>;
        /**
         * Call is already approved by this signatory.
         */
        AlreadyApproved: PlainDescriptor<undefined>;
        /**
         * Call doesn't need any (more) approvals.
         */
        NoApprovalsNeeded: PlainDescriptor<undefined>;
        /**
         * There are too few signatories in the list.
         */
        TooFewSignatories: PlainDescriptor<undefined>;
        /**
         * There are too many signatories in the list.
         */
        TooManySignatories: PlainDescriptor<undefined>;
        /**
         * The signatories were provided out of order; they should be ordered.
         */
        SignatoriesOutOfOrder: PlainDescriptor<undefined>;
        /**
         * The sender was contained in the other signatories; it shouldn't be.
         */
        SenderInSignatories: PlainDescriptor<undefined>;
        /**
         * Multisig operation not found in storage.
         */
        NotFound: PlainDescriptor<undefined>;
        /**
         * Only the account that originally created the multisig is able to cancel it or update
         * its deposits.
         */
        NotOwner: PlainDescriptor<undefined>;
        /**
         * No timepoint was given, yet the multisig operation is already underway.
         */
        NoTimepoint: PlainDescriptor<undefined>;
        /**
         * A different timepoint was given to the multisig operation that is underway.
         */
        WrongTimepoint: PlainDescriptor<undefined>;
        /**
         * A timepoint was given, yet no multisig operation is underway.
         */
        UnexpectedTimepoint: PlainDescriptor<undefined>;
        /**
         * The maximum weight information provided was too low.
         */
        MaxWeightTooLow: PlainDescriptor<undefined>;
        /**
         * The data to be stored is already stored.
         */
        AlreadyStored: PlainDescriptor<undefined>;
    };
    Bounties: {
        /**
         * Proposer's balance is too low.
         */
        InsufficientProposersBalance: PlainDescriptor<undefined>;
        /**
         * No proposal or bounty at that index.
         */
        InvalidIndex: PlainDescriptor<undefined>;
        /**
         * The reason given is just too big.
         */
        ReasonTooBig: PlainDescriptor<undefined>;
        /**
         * The bounty status is unexpected.
         */
        UnexpectedStatus: PlainDescriptor<undefined>;
        /**
         * Require bounty curator.
         */
        RequireCurator: PlainDescriptor<undefined>;
        /**
         * Invalid bounty value.
         */
        InvalidValue: PlainDescriptor<undefined>;
        /**
         * Invalid bounty fee.
         */
        InvalidFee: PlainDescriptor<undefined>;
        /**
         * A bounty payout is pending.
         * To cancel the bounty, you must unassign and slash the curator.
         */
        PendingPayout: PlainDescriptor<undefined>;
        /**
         * The bounties cannot be claimed/closed because it's still in the countdown period.
         */
        Premature: PlainDescriptor<undefined>;
        /**
         * The bounty cannot be closed because it has active child bounties.
         */
        HasActiveChildBounty: PlainDescriptor<undefined>;
        /**
         * Too many approvals are already queued.
         */
        TooManyQueued: PlainDescriptor<undefined>;
        /**
         * User is not the proposer of the bounty.
         */
        NotProposer: PlainDescriptor<undefined>;
        /**
         * The bounty is still active and its account cannot be reclaimed.
         */
        BountyStillActive: PlainDescriptor<undefined>;
    };
    Assets: {
        /**
         * Account balance must be greater than or equal to the transfer amount.
         */
        BalanceLow: PlainDescriptor<undefined>;
        /**
         * The account to alter does not exist.
         */
        NoAccount: PlainDescriptor<undefined>;
        /**
         * The signing account has no permission to do the operation.
         */
        NoPermission: PlainDescriptor<undefined>;
        /**
         * The given asset ID is unknown.
         */
        Unknown: PlainDescriptor<undefined>;
        /**
         * The origin account is frozen.
         */
        Frozen: PlainDescriptor<undefined>;
        /**
         * The asset ID is already taken.
         */
        InUse: PlainDescriptor<undefined>;
        /**
         * Invalid witness data given.
         */
        BadWitness: PlainDescriptor<undefined>;
        /**
         * Minimum balance should be non-zero.
         */
        MinBalanceZero: PlainDescriptor<undefined>;
        /**
         * Unable to increment the consumer reference counters on the account. Either no provider
         * reference exists to allow a non-zero balance of a non-self-sufficient asset, or one
         * fewer then the maximum number of consumers has been reached.
         */
        UnavailableConsumer: PlainDescriptor<undefined>;
        /**
         * Invalid metadata given.
         */
        BadMetadata: PlainDescriptor<undefined>;
        /**
         * No approval exists that would allow the transfer.
         */
        Unapproved: PlainDescriptor<undefined>;
        /**
         * The source account would not survive the transfer and it needs to stay alive.
         */
        WouldDie: PlainDescriptor<undefined>;
        /**
         * The asset-account already exists.
         */
        AlreadyExists: PlainDescriptor<undefined>;
        /**
         * The asset-account doesn't have an associated deposit.
         */
        NoDeposit: PlainDescriptor<undefined>;
        /**
         * The operation would result in funds being burned.
         */
        WouldBurn: PlainDescriptor<undefined>;
        /**
         * The asset is a live asset and is actively being used. Usually emit for operations such
         * as `start_destroy` which require the asset to be in a destroying state.
         */
        LiveAsset: PlainDescriptor<undefined>;
        /**
         * The asset is not live, and likely being destroyed.
         */
        AssetNotLive: PlainDescriptor<undefined>;
        /**
         * The asset status is not the expected status.
         */
        IncorrectStatus: PlainDescriptor<undefined>;
        /**
         * The asset should be frozen before the given operation.
         */
        NotFrozen: PlainDescriptor<undefined>;
        /**
         * Callback action resulted in error
         */
        CallbackFailed: PlainDescriptor<undefined>;
        /**
         * The asset ID is not the one required by [`Config::AssetIdAllocator`].
         */
        BadAssetId: PlainDescriptor<undefined>;
        /**
         * The [`Config::AssetIdAllocator`] cannot allocate the asset ID: the id space is
         * exhausted.
         */
        AssetIdAllocationFailed: PlainDescriptor<undefined>;
        /**
         * The asset cannot be destroyed because some accounts for this asset contain freezes.
         */
        ContainsFreezes: PlainDescriptor<undefined>;
        /**
         * The asset cannot be destroyed because some accounts for this asset contain holds.
         */
        ContainsHolds: PlainDescriptor<undefined>;
        /**
         * Tried setting too many reserves.
         */
        TooManyReserves: PlainDescriptor<undefined>;
        /**
         * The asset deposit could not be fully moved due to a lock or freeze on the owner.
         */
        IncompleteDepositTransfer: PlainDescriptor<undefined>;
    };
    PoolAssets: {
        /**
         * Account balance must be greater than or equal to the transfer amount.
         */
        BalanceLow: PlainDescriptor<undefined>;
        /**
         * The account to alter does not exist.
         */
        NoAccount: PlainDescriptor<undefined>;
        /**
         * The signing account has no permission to do the operation.
         */
        NoPermission: PlainDescriptor<undefined>;
        /**
         * The given asset ID is unknown.
         */
        Unknown: PlainDescriptor<undefined>;
        /**
         * The origin account is frozen.
         */
        Frozen: PlainDescriptor<undefined>;
        /**
         * The asset ID is already taken.
         */
        InUse: PlainDescriptor<undefined>;
        /**
         * Invalid witness data given.
         */
        BadWitness: PlainDescriptor<undefined>;
        /**
         * Minimum balance should be non-zero.
         */
        MinBalanceZero: PlainDescriptor<undefined>;
        /**
         * Unable to increment the consumer reference counters on the account. Either no provider
         * reference exists to allow a non-zero balance of a non-self-sufficient asset, or one
         * fewer then the maximum number of consumers has been reached.
         */
        UnavailableConsumer: PlainDescriptor<undefined>;
        /**
         * Invalid metadata given.
         */
        BadMetadata: PlainDescriptor<undefined>;
        /**
         * No approval exists that would allow the transfer.
         */
        Unapproved: PlainDescriptor<undefined>;
        /**
         * The source account would not survive the transfer and it needs to stay alive.
         */
        WouldDie: PlainDescriptor<undefined>;
        /**
         * The asset-account already exists.
         */
        AlreadyExists: PlainDescriptor<undefined>;
        /**
         * The asset-account doesn't have an associated deposit.
         */
        NoDeposit: PlainDescriptor<undefined>;
        /**
         * The operation would result in funds being burned.
         */
        WouldBurn: PlainDescriptor<undefined>;
        /**
         * The asset is a live asset and is actively being used. Usually emit for operations such
         * as `start_destroy` which require the asset to be in a destroying state.
         */
        LiveAsset: PlainDescriptor<undefined>;
        /**
         * The asset is not live, and likely being destroyed.
         */
        AssetNotLive: PlainDescriptor<undefined>;
        /**
         * The asset status is not the expected status.
         */
        IncorrectStatus: PlainDescriptor<undefined>;
        /**
         * The asset should be frozen before the given operation.
         */
        NotFrozen: PlainDescriptor<undefined>;
        /**
         * Callback action resulted in error
         */
        CallbackFailed: PlainDescriptor<undefined>;
        /**
         * The asset ID is not the one required by [`Config::AssetIdAllocator`].
         */
        BadAssetId: PlainDescriptor<undefined>;
        /**
         * The [`Config::AssetIdAllocator`] cannot allocate the asset ID: the id space is
         * exhausted.
         */
        AssetIdAllocationFailed: PlainDescriptor<undefined>;
        /**
         * The asset cannot be destroyed because some accounts for this asset contain freezes.
         */
        ContainsFreezes: PlainDescriptor<undefined>;
        /**
         * The asset cannot be destroyed because some accounts for this asset contain holds.
         */
        ContainsHolds: PlainDescriptor<undefined>;
        /**
         * Tried setting too many reserves.
         */
        TooManyReserves: PlainDescriptor<undefined>;
        /**
         * The asset deposit could not be fully moved due to a lock or freeze on the owner.
         */
        IncompleteDepositTransfer: PlainDescriptor<undefined>;
    };
    Beefy: {
        /**
         * A key ownership proof provided as part of an equivocation report is invalid.
         */
        InvalidKeyOwnershipProof: PlainDescriptor<undefined>;
        /**
         * A double voting proof provided as part of an equivocation report is invalid.
         */
        InvalidDoubleVotingProof: PlainDescriptor<undefined>;
        /**
         * A fork voting proof provided as part of an equivocation report is invalid.
         */
        InvalidForkVotingProof: PlainDescriptor<undefined>;
        /**
         * A future block voting proof provided as part of an equivocation report is invalid.
         */
        InvalidFutureBlockVotingProof: PlainDescriptor<undefined>;
        /**
         * The session of the equivocation proof is invalid
         */
        InvalidEquivocationProofSession: PlainDescriptor<undefined>;
        /**
         * The session of the equivocation proof is not in the mapping (anymore)
         */
        InvalidEquivocationProofSessionMember: PlainDescriptor<undefined>;
        /**
         * A given equivocation report is valid but already previously reported.
         */
        DuplicateOffenceReport: PlainDescriptor<undefined>;
        /**
         * Submitted configuration is invalid.
         */
        InvalidConfiguration: PlainDescriptor<undefined>;
    };
    Lottery: {
        /**
         * A lottery has not been configured.
         */
        NotConfigured: PlainDescriptor<undefined>;
        /**
         * A lottery is already in progress.
         */
        InProgress: PlainDescriptor<undefined>;
        /**
         * A lottery has already ended.
         */
        AlreadyEnded: PlainDescriptor<undefined>;
        /**
         * The call is not valid for an open lottery.
         */
        InvalidCall: PlainDescriptor<undefined>;
        /**
         * You are already participating in the lottery with this call.
         */
        AlreadyParticipating: PlainDescriptor<undefined>;
        /**
         * Too many calls for a single lottery.
         */
        TooManyCalls: PlainDescriptor<undefined>;
        /**
         * Failed to encode calls
         */
        EncodingFailed: PlainDescriptor<undefined>;
    };
    Uniques: {
        /**
         * The signing account has no permission to do the operation.
         */
        NoPermission: PlainDescriptor<undefined>;
        /**
         * The given item ID is unknown.
         */
        UnknownCollection: PlainDescriptor<undefined>;
        /**
         * The item ID has already been used for an item.
         */
        AlreadyExists: PlainDescriptor<undefined>;
        /**
         * The owner turned out to be different to what was expected.
         */
        WrongOwner: PlainDescriptor<undefined>;
        /**
         * Invalid witness data given.
         */
        BadWitness: PlainDescriptor<undefined>;
        /**
         * The item ID is already taken.
         */
        InUse: PlainDescriptor<undefined>;
        /**
         * The item or collection is frozen.
         */
        Frozen: PlainDescriptor<undefined>;
        /**
         * The delegate turned out to be different to what was expected.
         */
        WrongDelegate: PlainDescriptor<undefined>;
        /**
         * There is no delegate approved.
         */
        NoDelegate: PlainDescriptor<undefined>;
        /**
         * No approval exists that would allow the transfer.
         */
        Unapproved: PlainDescriptor<undefined>;
        /**
         * The named owner has not signed ownership of the collection is acceptable.
         */
        Unaccepted: PlainDescriptor<undefined>;
        /**
         * The item is locked.
         */
        Locked: PlainDescriptor<undefined>;
        /**
         * All items have been minted.
         */
        MaxSupplyReached: PlainDescriptor<undefined>;
        /**
         * The max supply has already been set.
         */
        MaxSupplyAlreadySet: PlainDescriptor<undefined>;
        /**
         * The provided max supply is less to the amount of items a collection already has.
         */
        MaxSupplyTooSmall: PlainDescriptor<undefined>;
        /**
         * The given item ID is unknown.
         */
        UnknownItem: PlainDescriptor<undefined>;
        /**
         * Item is not for sale.
         */
        NotForSale: PlainDescriptor<undefined>;
        /**
         * The provided bid is too low.
         */
        BidTooLow: PlainDescriptor<undefined>;
        /**
         * No metadata is found.
         */
        NoMetadata: PlainDescriptor<undefined>;
        /**
         * Wrong metadata key/value bytes supplied.
         */
        WrongMetadata: PlainDescriptor<undefined>;
        /**
         * An attribute is not found.
         */
        AttributeNotFound: PlainDescriptor<undefined>;
        /**
         * Wrong attribute key/value bytes supplied.
         */
        WrongAttribute: PlainDescriptor<undefined>;
    };
    Nfts: {
        /**
         * The signing account has no permission to do the operation.
         */
        NoPermission: PlainDescriptor<undefined>;
        /**
         * The given item ID is unknown.
         */
        UnknownCollection: PlainDescriptor<undefined>;
        /**
         * The item ID has already been used for an item.
         */
        AlreadyExists: PlainDescriptor<undefined>;
        /**
         * The approval had a deadline that expired, so the approval isn't valid anymore.
         */
        ApprovalExpired: PlainDescriptor<undefined>;
        /**
         * The owner turned out to be different to what was expected.
         */
        WrongOwner: PlainDescriptor<undefined>;
        /**
         * The witness data given does not match the current state of the chain.
         */
        BadWitness: PlainDescriptor<undefined>;
        /**
         * Collection ID is already taken.
         */
        CollectionIdInUse: PlainDescriptor<undefined>;
        /**
         * Items within that collection are non-transferable.
         */
        ItemsNonTransferable: PlainDescriptor<undefined>;
        /**
         * The provided account is not a delegate.
         */
        NotDelegate: PlainDescriptor<undefined>;
        /**
         * The delegate turned out to be different to what was expected.
         */
        WrongDelegate: PlainDescriptor<undefined>;
        /**
         * No approval exists that would allow the transfer.
         */
        Unapproved: PlainDescriptor<undefined>;
        /**
         * The named owner has not signed ownership acceptance of the collection.
         */
        Unaccepted: PlainDescriptor<undefined>;
        /**
         * The item is locked (non-transferable).
         */
        ItemLocked: PlainDescriptor<undefined>;
        /**
         * Item's attributes are locked.
         */
        LockedItemAttributes: PlainDescriptor<undefined>;
        /**
         * Collection's attributes are locked.
         */
        LockedCollectionAttributes: PlainDescriptor<undefined>;
        /**
         * Item's metadata is locked.
         */
        LockedItemMetadata: PlainDescriptor<undefined>;
        /**
         * Collection's metadata is locked.
         */
        LockedCollectionMetadata: PlainDescriptor<undefined>;
        /**
         * All items have been minted.
         */
        MaxSupplyReached: PlainDescriptor<undefined>;
        /**
         * The max supply is locked and can't be changed.
         */
        MaxSupplyLocked: PlainDescriptor<undefined>;
        /**
         * The provided max supply is less than the number of items a collection already has.
         */
        MaxSupplyTooSmall: PlainDescriptor<undefined>;
        /**
         * The given item ID is unknown.
         */
        UnknownItem: PlainDescriptor<undefined>;
        /**
         * Swap doesn't exist.
         */
        UnknownSwap: PlainDescriptor<undefined>;
        /**
         * The given item has no metadata set.
         */
        MetadataNotFound: PlainDescriptor<undefined>;
        /**
         * The provided attribute can't be found.
         */
        AttributeNotFound: PlainDescriptor<undefined>;
        /**
         * Item is not for sale.
         */
        NotForSale: PlainDescriptor<undefined>;
        /**
         * The provided bid is too low.
         */
        BidTooLow: PlainDescriptor<undefined>;
        /**
         * The item has reached its approval limit.
         */
        ReachedApprovalLimit: PlainDescriptor<undefined>;
        /**
         * The deadline has already expired.
         */
        DeadlineExpired: PlainDescriptor<undefined>;
        /**
         * The duration provided should be less than or equal to `MaxDeadlineDuration`.
         */
        WrongDuration: PlainDescriptor<undefined>;
        /**
         * The method is disabled by system settings.
         */
        MethodDisabled: PlainDescriptor<undefined>;
        /**
         * The provided setting can't be set.
         */
        WrongSetting: PlainDescriptor<undefined>;
        /**
         * Item's config already exists and should be equal to the provided one.
         */
        InconsistentItemConfig: PlainDescriptor<undefined>;
        /**
         * Config for a collection or an item can't be found.
         */
        NoConfig: PlainDescriptor<undefined>;
        /**
         * Some roles were not cleared.
         */
        RolesNotCleared: PlainDescriptor<undefined>;
        /**
         * Mint has not started yet.
         */
        MintNotStarted: PlainDescriptor<undefined>;
        /**
         * Mint has already ended.
         */
        MintEnded: PlainDescriptor<undefined>;
        /**
         * The provided Item was already used for claiming.
         */
        AlreadyClaimed: PlainDescriptor<undefined>;
        /**
         * The provided data is incorrect.
         */
        IncorrectData: PlainDescriptor<undefined>;
        /**
         * The extrinsic was sent by the wrong origin.
         */
        WrongOrigin: PlainDescriptor<undefined>;
        /**
         * The provided signature is incorrect.
         */
        WrongSignature: PlainDescriptor<undefined>;
        /**
         * The provided metadata might be too long.
         */
        IncorrectMetadata: PlainDescriptor<undefined>;
        /**
         * Can't set more attributes per one call.
         */
        MaxAttributesLimitReached: PlainDescriptor<undefined>;
        /**
         * The provided namespace isn't supported in this call.
         */
        WrongNamespace: PlainDescriptor<undefined>;
        /**
         * Can't delete non-empty collections.
         */
        CollectionNotEmpty: PlainDescriptor<undefined>;
        /**
         * The witness data should be provided.
         */
        WitnessRequired: PlainDescriptor<undefined>;
    };
    NftFractionalization: {
        /**
         * Asset ID does not correspond to locked NFT.
         */
        IncorrectAssetId: PlainDescriptor<undefined>;
        /**
         * The signing account has no permission to do the operation.
         */
        NoPermission: PlainDescriptor<undefined>;
        /**
         * NFT doesn't exist.
         */
        NftNotFound: PlainDescriptor<undefined>;
        /**
         * NFT has not yet been fractionalised.
         */
        NftNotFractionalized: PlainDescriptor<undefined>;
    };
    TransactionStorage: {
        /**
         * Attempted to call `store`/`renew` outside of block execution.
         */
        BadContext: PlainDescriptor<undefined>;
        /**
         * Data size is not in the allowed range.
         */
        BadDataSize: PlainDescriptor<undefined>;
        /**
         * Too many transactions in the block.
         */
        TooManyTransactions: PlainDescriptor<undefined>;
        /**
         * Invalid configuration.
         */
        NotConfigured: PlainDescriptor<undefined>;
        /**
         * Renewed extrinsic is not found.
         */
        RenewedNotFound: PlainDescriptor<undefined>;
        /**
         * Proof was not expected in this block.
         */
        UnexpectedProof: PlainDescriptor<undefined>;
        /**
         * Proof failed verification.
         */
        InvalidProof: PlainDescriptor<undefined>;
        /**
         * Missing storage proof.
         */
        MissingProof: PlainDescriptor<undefined>;
        /**
         * Unable to verify proof because state data is missing.
         */
        MissingStateData: PlainDescriptor<undefined>;
        /**
         * Double proof check in the block.
         */
        DoubleCheck: PlainDescriptor<undefined>;
        /**
         * Storage proof was not checked in the block.
         */
        ProofNotChecked: PlainDescriptor<undefined>;
        /**
         * Authorization was not found.
         */
        AuthorizationNotFound: PlainDescriptor<undefined>;
        /**
         * Authorization has not expired.
         */
        AuthorizationNotExpired: PlainDescriptor<undefined>;
    };
    VoterList: {
        /**
         * A error in the list interface implementation.
         */
        List: PlainDescriptor<Anonymize<Ictkqqlhdjt761>>;
        /**
         * Could not update a node, because the pallet is locked.
         */
        Locked: PlainDescriptor<undefined>;
    };
    ChildBounties: {
        /**
         * The parent bounty is not in active state.
         */
        ParentBountyNotActive: PlainDescriptor<undefined>;
        /**
         * The bounty balance is not enough to add new child-bounty.
         */
        InsufficientBountyBalance: PlainDescriptor<undefined>;
        /**
         * Number of child bounties exceeds limit `MaxActiveChildBountyCount`.
         */
        TooManyChildBounties: PlainDescriptor<undefined>;
    };
    Remark: {
        /**
         * Attempting to store empty data.
         */
        Empty: PlainDescriptor<undefined>;
        /**
         * Attempted to call `store` outside of block execution.
         */
        BadContext: PlainDescriptor<undefined>;
    };
    NominationPools: {
        /**
         * A (bonded) pool id does not exist.
         */
        PoolNotFound: PlainDescriptor<undefined>;
        /**
         * An account is not a member.
         */
        PoolMemberNotFound: PlainDescriptor<undefined>;
        /**
         * A reward pool does not exist. In all cases this is a system logic error.
         */
        RewardPoolNotFound: PlainDescriptor<undefined>;
        /**
         * A sub pool does not exist.
         */
        SubPoolsNotFound: PlainDescriptor<undefined>;
        /**
         * An account is already delegating in another pool. An account may only belong to one
         * pool at a time.
         */
        AccountBelongsToOtherPool: PlainDescriptor<undefined>;
        /**
         * The member is fully unbonded (and thus cannot access the bonded and reward pool
         * anymore to, for example, collect rewards).
         */
        FullyUnbonding: PlainDescriptor<undefined>;
        /**
         * The member cannot unbond further chunks due to reaching the limit.
         */
        MaxUnbondingLimit: PlainDescriptor<undefined>;
        /**
         * None of the funds can be withdrawn yet because the bonding duration has not passed.
         */
        CannotWithdrawAny: PlainDescriptor<undefined>;
        /**
         * The amount does not meet the minimum bond to either join or create a pool.
         *
         * The depositor can never unbond to a value less than `Pallet::depositor_min_bond`. The
         * caller does not have nominating permissions for the pool. Members can never unbond to a
         * value below `MinJoinBond`.
         */
        MinimumBondNotMet: PlainDescriptor<undefined>;
        /**
         * The transaction could not be executed due to overflow risk for the pool.
         */
        OverflowRisk: PlainDescriptor<undefined>;
        /**
         * A pool must be in [`PoolState::Destroying`] in order for the depositor to unbond or for
         * other members to be permissionlessly unbonded.
         */
        NotDestroying: PlainDescriptor<undefined>;
        /**
         * The caller does not have nominating permissions for the pool.
         */
        NotNominator: PlainDescriptor<undefined>;
        /**
         * Either a) the caller cannot make a valid kick or b) the pool is not destroying.
         */
        NotKickerOrDestroying: PlainDescriptor<undefined>;
        /**
         * The pool is not open to join
         */
        NotOpen: PlainDescriptor<undefined>;
        /**
         * The system is maxed out on pools.
         */
        MaxPools: PlainDescriptor<undefined>;
        /**
         * Too many members in the pool or system.
         */
        MaxPoolMembers: PlainDescriptor<undefined>;
        /**
         * The pools state cannot be changed.
         */
        CanNotChangeState: PlainDescriptor<undefined>;
        /**
         * The caller does not have adequate permissions.
         */
        DoesNotHavePermission: PlainDescriptor<undefined>;
        /**
         * Metadata exceeds [`Config::MaxMetadataLen`]
         */
        MetadataExceedsMaxLen: PlainDescriptor<undefined>;
        /**
         * Some error occurred that should never happen. This should be reported to the
         * maintainers.
         */
        Defensive: PlainDescriptor<Anonymize<Ie2db4l6126rkt>>;
        /**
         * Partial unbonding now allowed permissionlessly.
         */
        PartialUnbondNotAllowedPermissionlessly: PlainDescriptor<undefined>;
        /**
         * The pool's max commission cannot be set higher than the existing value.
         */
        MaxCommissionRestricted: PlainDescriptor<undefined>;
        /**
         * The supplied commission exceeds the max allowed commission.
         */
        CommissionExceedsMaximum: PlainDescriptor<undefined>;
        /**
         * The supplied commission exceeds global maximum commission.
         */
        CommissionExceedsGlobalMaximum: PlainDescriptor<undefined>;
        /**
         * Not enough blocks have surpassed since the last commission update.
         */
        CommissionChangeThrottled: PlainDescriptor<undefined>;
        /**
         * The submitted changes to commission change rate are not allowed.
         */
        CommissionChangeRateNotAllowed: PlainDescriptor<undefined>;
        /**
         * There is no pending commission to claim.
         */
        NoPendingCommission: PlainDescriptor<undefined>;
        /**
         * No commission current has been set.
         */
        NoCommissionCurrentSet: PlainDescriptor<undefined>;
        /**
         * Pool id currently in use.
         */
        PoolIdInUse: PlainDescriptor<undefined>;
        /**
         * Pool id provided is not correct/usable.
         */
        InvalidPoolId: PlainDescriptor<undefined>;
        /**
         * Bonding extra is restricted to the exact pending reward amount.
         */
        BondExtraRestricted: PlainDescriptor<undefined>;
        /**
         * No imbalance in the ED deposit for the pool.
         */
        NothingToAdjust: PlainDescriptor<undefined>;
        /**
         * No slash pending that can be applied to the member.
         */
        NothingToSlash: PlainDescriptor<undefined>;
        /**
         * The slash amount is too low to be applied.
         */
        SlashTooLow: PlainDescriptor<undefined>;
        /**
         * The pool or member delegation has already migrated to delegate stake.
         */
        AlreadyMigrated: PlainDescriptor<undefined>;
        /**
         * The pool or member delegation has not migrated yet to delegate stake.
         */
        NotMigrated: PlainDescriptor<undefined>;
        /**
         * This call is not allowed in the current state of the pallet.
         */
        NotSupported: PlainDescriptor<undefined>;
        /**
         * Account is restricted from participation in pools. This may happen if the account is
         * staking in another way already.
         */
        Restricted: PlainDescriptor<undefined>;
    };
    AssetConversion: {
        /**
         * Provided asset pair is not supported for pool.
         */
        InvalidAssetPair: PlainDescriptor<undefined>;
        /**
         * Pool already exists.
         */
        PoolExists: PlainDescriptor<undefined>;
        /**
         * Desired amount can't be zero.
         */
        WrongDesiredAmount: PlainDescriptor<undefined>;
        /**
         * Provided amount should be greater than or equal to the existential deposit/asset's
         * minimal amount.
         */
        AmountOneLessThanMinimal: PlainDescriptor<undefined>;
        /**
         * Provided amount should be greater than or equal to the existential deposit/asset's
         * minimal amount.
         */
        AmountTwoLessThanMinimal: PlainDescriptor<undefined>;
        /**
         * Reserve needs to always be greater than or equal to the existential deposit/asset's
         * minimal amount.
         */
        ReserveLeftLessThanMinimal: PlainDescriptor<undefined>;
        /**
         * Desired amount can't be equal to the pool reserve.
         */
        AmountOutTooHigh: PlainDescriptor<undefined>;
        /**
         * The pool doesn't exist.
         */
        PoolNotFound: PlainDescriptor<undefined>;
        /**
         * An overflow happened.
         */
        Overflow: PlainDescriptor<undefined>;
        /**
         * The minimal amount requirement for the first token in the pair wasn't met.
         */
        AssetOneDepositDidNotMeetMinimum: PlainDescriptor<undefined>;
        /**
         * The minimal amount requirement for the second token in the pair wasn't met.
         */
        AssetTwoDepositDidNotMeetMinimum: PlainDescriptor<undefined>;
        /**
         * The minimal amount requirement for the first token in the pair wasn't met.
         */
        AssetOneWithdrawalDidNotMeetMinimum: PlainDescriptor<undefined>;
        /**
         * The minimal amount requirement for the second token in the pair wasn't met.
         */
        AssetTwoWithdrawalDidNotMeetMinimum: PlainDescriptor<undefined>;
        /**
         * Optimal calculated amount is less than desired.
         */
        OptimalAmountLessThanDesired: PlainDescriptor<undefined>;
        /**
         * Insufficient liquidity minted.
         */
        InsufficientLiquidityMinted: PlainDescriptor<undefined>;
        /**
         * Requested liquidity can't be zero.
         */
        ZeroLiquidity: PlainDescriptor<undefined>;
        /**
         * Amount can't be zero.
         */
        ZeroAmount: PlainDescriptor<undefined>;
        /**
         * Calculated amount out is less than provided minimum amount.
         */
        ProvidedMinimumNotSufficientForSwap: PlainDescriptor<undefined>;
        /**
         * Provided maximum amount is not sufficient for swap.
         */
        ProvidedMaximumNotSufficientForSwap: PlainDescriptor<undefined>;
        /**
         * The provided path must consists of 2 assets at least.
         */
        InvalidPath: PlainDescriptor<undefined>;
        /**
         * The provided path must consists of unique assets.
         */
        NonUniquePath: PlainDescriptor<undefined>;
        /**
         * It was not possible to get or increment the Id of the pool.
         */
        IncorrectPoolAssetId: PlainDescriptor<undefined>;
        /**
         * The destination account cannot exist with the swapped funds.
         */
        BelowMinimum: PlainDescriptor<undefined>;
        /**
         * The pool exists but has no liquidity (at least one of the reserves is zero).
         */
        PoolEmpty: PlainDescriptor<undefined>;
        /**
         * The fee exceeds [`Config::MaxSwapFee`].
         */
        FeeTooHigh: PlainDescriptor<undefined>;
    };
    FastUnstake: {
        /**
         * The provided Controller account was not found.
         *
         * This means that the given account is not bonded.
         */
        NotController: PlainDescriptor<undefined>;
        /**
         * The bonded account has already been queued.
         */
        AlreadyQueued: PlainDescriptor<undefined>;
        /**
         * The bonded account has active unlocking chunks.
         */
        NotFullyBonded: PlainDescriptor<undefined>;
        /**
         * The provided un-staker is not in the `Queue`.
         */
        NotQueued: PlainDescriptor<undefined>;
        /**
         * The provided un-staker is already in Head, and cannot deregister.
         */
        AlreadyHead: PlainDescriptor<undefined>;
        /**
         * The call is not allowed at this point because the pallet is not active.
         */
        CallNotAllowed: PlainDescriptor<undefined>;
    };
    MessageQueue: {
        /**
         * Page is not reapable because it has items remaining to be processed and is not old
         * enough.
         */
        NotReapable: PlainDescriptor<undefined>;
        /**
         * Page to be reaped does not exist.
         */
        NoPage: PlainDescriptor<undefined>;
        /**
         * The referenced message could not be found.
         */
        NoMessage: PlainDescriptor<undefined>;
        /**
         * The message was already processed and cannot be processed again.
         */
        AlreadyProcessed: PlainDescriptor<undefined>;
        /**
         * The message is queued for future execution.
         */
        Queued: PlainDescriptor<undefined>;
        /**
         * There is temporarily not enough weight to continue servicing messages.
         */
        InsufficientWeight: PlainDescriptor<undefined>;
        /**
         * This message is temporarily unprocessable.
         *
         * Such errors are expected, but not guaranteed, to resolve themselves eventually through
         * retrying.
         */
        TemporarilyUnprocessable: PlainDescriptor<undefined>;
        /**
         * The queue is paused and no message can be executed from it.
         *
         * This can change at any time and may resolve in the future by re-trying.
         */
        QueuePaused: PlainDescriptor<undefined>;
        /**
         * Another call is in progress and needs to finish before this call can happen.
         */
        RecursiveDisallowed: PlainDescriptor<undefined>;
    };
    TxPause: {
        /**
         * The call is paused.
         */
        IsPaused: PlainDescriptor<undefined>;
        /**
         * The call is unpaused.
         */
        IsUnpaused: PlainDescriptor<undefined>;
        /**
         * The call is whitelisted and cannot be paused.
         */
        Unpausable: PlainDescriptor<undefined>;
        /**
        
         */
        NotFound: PlainDescriptor<undefined>;
    };
    SafeMode: {
        /**
         * The safe-mode is (already or still) entered.
         */
        Entered: PlainDescriptor<undefined>;
        /**
         * The safe-mode is (already or still) exited.
         */
        Exited: PlainDescriptor<undefined>;
        /**
         * This functionality of the pallet is disabled by the configuration.
         */
        NotConfigured: PlainDescriptor<undefined>;
        /**
         * There is no balance reserved.
         */
        NoDeposit: PlainDescriptor<undefined>;
        /**
         * The account already has a deposit reserved and can therefore not enter or extend again.
         */
        AlreadyDeposited: PlainDescriptor<undefined>;
        /**
         * This deposit cannot be released yet.
         */
        CannotReleaseYet: PlainDescriptor<undefined>;
        /**
         * An error from the underlying `Currency`.
         */
        CurrencyError: PlainDescriptor<undefined>;
    };
    MultiBlockMigrations: {
        /**
         * The operation cannot complete since some MBMs are ongoing.
         */
        Ongoing: PlainDescriptor<undefined>;
    };
    Broker: {
        /**
         * The given region identity is not known.
         */
        UnknownRegion: PlainDescriptor<undefined>;
        /**
         * The owner of the region is not the origin.
         */
        NotOwner: PlainDescriptor<undefined>;
        /**
         * The pivot point of the partition at or after the end of the region.
         */
        PivotTooLate: PlainDescriptor<undefined>;
        /**
         * The pivot point of the partition at the beginning of the region.
         */
        PivotTooEarly: PlainDescriptor<undefined>;
        /**
         * The pivot mask for the interlacing is not contained within the region's interlace mask.
         */
        ExteriorPivot: PlainDescriptor<undefined>;
        /**
         * The pivot mask for the interlacing is void (and therefore unschedulable).
         */
        VoidPivot: PlainDescriptor<undefined>;
        /**
         * The pivot mask for the interlacing is complete (and therefore not a strict subset).
         */
        CompletePivot: PlainDescriptor<undefined>;
        /**
         * The workplan of the pallet's state is invalid. This indicates a state corruption.
         */
        CorruptWorkplan: PlainDescriptor<undefined>;
        /**
         * There is no sale happening currently.
         */
        NoSales: PlainDescriptor<undefined>;
        /**
         * The price limit is exceeded.
         */
        Overpriced: PlainDescriptor<undefined>;
        /**
         * There are no cores available.
         */
        Unavailable: PlainDescriptor<undefined>;
        /**
         * The sale limit has been reached.
         */
        SoldOut: PlainDescriptor<undefined>;
        /**
         * The renewal operation is not valid at the current time (it may become valid in the next
         * sale).
         */
        WrongTime: PlainDescriptor<undefined>;
        /**
         * Invalid attempt to renew.
         */
        NotAllowed: PlainDescriptor<undefined>;
        /**
         * This pallet has not yet been initialized.
         */
        Uninitialized: PlainDescriptor<undefined>;
        /**
         * The purchase cannot happen yet as the sale period is yet to begin.
         */
        TooEarly: PlainDescriptor<undefined>;
        /**
         * There is no work to be done.
         */
        NothingToDo: PlainDescriptor<undefined>;
        /**
         * The maximum amount of reservations has already been reached.
         */
        TooManyReservations: PlainDescriptor<undefined>;
        /**
         * The maximum amount of leases has already been reached.
         */
        TooManyLeases: PlainDescriptor<undefined>;
        /**
         * The lease does not exist.
         */
        LeaseNotFound: PlainDescriptor<undefined>;
        /**
         * The revenue for the Instantaneous Core Sales of this period is not (yet) known and thus
         * this operation cannot proceed.
         */
        UnknownRevenue: PlainDescriptor<undefined>;
        /**
         * The identified contribution to the Instantaneous Core Pool is unknown.
         */
        UnknownContribution: PlainDescriptor<undefined>;
        /**
         * The workload assigned for renewal is incomplete. This is unexpected and indicates a
         * logic error.
         */
        IncompleteAssignment: PlainDescriptor<undefined>;
        /**
         * An item cannot be dropped because it is still valid.
         */
        StillValid: PlainDescriptor<undefined>;
        /**
         * The history item does not exist.
         */
        NoHistory: PlainDescriptor<undefined>;
        /**
         * No reservation of the given index exists.
         */
        UnknownReservation: PlainDescriptor<undefined>;
        /**
         * The renewal record cannot be found.
         */
        UnknownRenewal: PlainDescriptor<undefined>;
        /**
         * The lease expiry time has already passed.
         */
        AlreadyExpired: PlainDescriptor<undefined>;
        /**
         * The configuration could not be applied because it is invalid.
         */
        InvalidConfig: PlainDescriptor<undefined>;
        /**
         * The revenue must be claimed for 1 or more timeslices.
         */
        NoClaimTimeslices: PlainDescriptor<undefined>;
        /**
         * The caller doesn't have the permission to enable or disable auto-renewal.
         */
        NoPermission: PlainDescriptor<undefined>;
        /**
         * We reached the limit for auto-renewals.
         */
        TooManyAutoRenewals: PlainDescriptor<undefined>;
        /**
         * Only cores which are assigned to a task can be auto-renewed.
         */
        NonTaskAutoRenewal: PlainDescriptor<undefined>;
        /**
         * Failed to get the sovereign account of a task.
         */
        SovereignAccountNotFound: PlainDescriptor<undefined>;
        /**
         * Attempted to disable auto-renewal for a core that didn't have it enabled.
         */
        AutoRenewalNotEnabled: PlainDescriptor<undefined>;
        /**
         * Attempted to force remove an assignment that doesn't exist.
         */
        AssignmentNotFound: PlainDescriptor<undefined>;
        /**
         * Needed to prevent spam attacks.The amount of credits the user attempted to purchase is
         * below `T::MinimumCreditPurchase`.
         */
        CreditPurchaseTooSmall: PlainDescriptor<undefined>;
    };
    AssetConversionMigration: {
        /**
         * Provided asset pair is not supported for pool.
         */
        InvalidAssetPair: PlainDescriptor<undefined>;
        /**
         * The pool doesn't exist.
         */
        PoolNotFound: PlainDescriptor<undefined>;
        /**
         * Pool's balance cannot be zero.
         */
        ZeroBalance: PlainDescriptor<undefined>;
        /**
         * Indicates a partial transfer of balance to the new account during a migration.
         */
        PartialTransfer: PlainDescriptor<undefined>;
    };
    Revive: {
        /**
         * Invalid schedule supplied, e.g. with zero weight of a basic operation.
         */
        InvalidSchedule: PlainDescriptor<undefined>;
        /**
         * Invalid combination of flags supplied to `seal_call` or `seal_delegate_call`.
         */
        InvalidCallFlags: PlainDescriptor<undefined>;
        /**
         * The executed contract exhausted its gas limit.
         */
        OutOfGas: PlainDescriptor<undefined>;
        /**
         * Performing the requested transfer failed. Probably because there isn't enough
         * free balance in the sender's account.
         */
        TransferFailed: PlainDescriptor<undefined>;
        /**
         * Performing a call was denied because the calling depth reached the limit
         * of what is specified in the schedule.
         */
        MaxCallDepthReached: PlainDescriptor<undefined>;
        /**
         * No contract was found at the specified address.
         */
        ContractNotFound: PlainDescriptor<undefined>;
        /**
         * No code could be found at the supplied code hash.
         */
        CodeNotFound: PlainDescriptor<undefined>;
        /**
         * No code info could be found at the supplied code hash.
         */
        CodeInfoNotFound: PlainDescriptor<undefined>;
        /**
         * A buffer outside of sandbox memory was passed to a contract API function.
         */
        OutOfBounds: PlainDescriptor<undefined>;
        /**
         * Input passed to a contract API function failed to decode as expected type.
         */
        DecodingFailed: PlainDescriptor<undefined>;
        /**
         * Contract trapped during execution.
         */
        ContractTrapped: PlainDescriptor<undefined>;
        /**
         * Event body or storage item exceeds [`limits::STORAGE_BYTES`].
         */
        ValueTooLarge: PlainDescriptor<undefined>;
        /**
         * Termination of a contract is not allowed while the contract is already
         * on the call stack. Can be triggered by `seal_terminate`.
         */
        TerminatedWhileReentrant: PlainDescriptor<undefined>;
        /**
         * `seal_call` forwarded this contracts input. It therefore is no longer available.
         */
        InputForwarded: PlainDescriptor<undefined>;
        /**
         * The amount of topics passed to `seal_deposit_events` exceeds the limit.
         */
        TooManyTopics: PlainDescriptor<undefined>;
        /**
         * A contract with the same AccountId already exists.
         */
        DuplicateContract: PlainDescriptor<undefined>;
        /**
         * A contract self destructed in its constructor.
         *
         * This can be triggered by a call to `seal_terminate`.
         */
        TerminatedInConstructor: PlainDescriptor<undefined>;
        /**
         * A call tried to invoke a contract that is flagged as non-reentrant.
         */
        ReentranceDenied: PlainDescriptor<undefined>;
        /**
         * A contract called into the runtime which then called back into this pallet.
         */
        ReenteredPallet: PlainDescriptor<undefined>;
        /**
         * A contract attempted to invoke a state modifying API while being in read-only mode.
         */
        StateChangeDenied: PlainDescriptor<undefined>;
        /**
         * Origin doesn't have enough balance to pay the required storage deposits.
         */
        StorageDepositNotEnoughFunds: PlainDescriptor<undefined>;
        /**
         * More storage was created than allowed by the storage deposit limit.
         */
        StorageDepositLimitExhausted: PlainDescriptor<undefined>;
        /**
         * Code removal was denied because the code is still in use by at least one contract.
         */
        CodeInUse: PlainDescriptor<undefined>;
        /**
         * The contract ran to completion but decided to revert its storage changes.
         * Please note that this error is only returned from extrinsics. When called directly
         * or via RPC an `Ok` will be returned. In this case the caller needs to inspect the flags
         * to determine whether a reversion has taken place.
         */
        ContractReverted: PlainDescriptor<undefined>;
        /**
         * The contract failed to compile or is missing the correct entry points.
         *
         * A more detailed error can be found on the node console if debug messages are enabled
         * by supplying `-lruntime::revive=debug`.
         */
        CodeRejected: PlainDescriptor<undefined>;
        /**
         * The code blob supplied is larger than [`limits::code::BLOB_BYTES`].
         */
        BlobTooLarge: PlainDescriptor<undefined>;
        /**
         * The contract declares too much memory (ro + rw + stack).
         */
        StaticMemoryTooLarge: PlainDescriptor<undefined>;
        /**
         * The program contains a basic block that is larger than allowed.
         */
        BasicBlockTooLarge: PlainDescriptor<undefined>;
        /**
         * The program contains an invalid instruction.
         */
        InvalidInstruction: PlainDescriptor<undefined>;
        /**
         * The contract has reached its maximum number of delegate dependencies.
         */
        MaxDelegateDependenciesReached: PlainDescriptor<undefined>;
        /**
         * The dependency was not found in the contract's delegate dependencies.
         */
        DelegateDependencyNotFound: PlainDescriptor<undefined>;
        /**
         * The contract already depends on the given delegate dependency.
         */
        DelegateDependencyAlreadyExists: PlainDescriptor<undefined>;
        /**
         * Can not add a delegate dependency to the code hash of the contract itself.
         */
        CannotAddSelfAsDelegateDependency: PlainDescriptor<undefined>;
        /**
         * Can not add more data to transient storage.
         */
        OutOfTransientStorage: PlainDescriptor<undefined>;
        /**
         * The contract tried to call a syscall which does not exist (at its current api level).
         */
        InvalidSyscall: PlainDescriptor<undefined>;
        /**
         * Invalid storage flags were passed to one of the storage syscalls.
         */
        InvalidStorageFlags: PlainDescriptor<undefined>;
        /**
         * PolkaVM failed during code execution. Probably due to a malformed program.
         */
        ExecutionFailed: PlainDescriptor<undefined>;
        /**
         * Failed to convert a U256 to a Balance.
         */
        BalanceConversionFailed: PlainDescriptor<undefined>;
        /**
         * Immutable data can only be set during deploys and only be read during calls.
         * Additionally, it is only valid to set the data once and it must not be empty.
         */
        InvalidImmutableAccess: PlainDescriptor<undefined>;
        /**
         * An `AccountID32` account tried to interact with the pallet without having a mapping.
         *
         * Call [`Pallet::map_account`] in order to create a mapping for the account.
         */
        AccountUnmapped: PlainDescriptor<undefined>;
        /**
         * Tried to map an account that is already mapped.
         */
        AccountAlreadyMapped: PlainDescriptor<undefined>;
        /**
         * The transaction used to dry-run a contract is invalid.
         */
        InvalidGenericTransaction: PlainDescriptor<undefined>;
        /**
         * The refcount of a code either over or underflowed.
         */
        RefcountOverOrUnderflow: PlainDescriptor<undefined>;
        /**
         * Unsupported precompile address.
         */
        UnsupportedPrecompileAddress: PlainDescriptor<undefined>;
        /**
         * The calldata exceeds [`limits::CALLDATA_BYTES`].
         */
        CallDataTooLarge: PlainDescriptor<undefined>;
        /**
         * The return data exceeds [`limits::CALLDATA_BYTES`].
         */
        ReturnDataTooLarge: PlainDescriptor<undefined>;
        /**
         * Invalid jump destination. Dynamic jumps points to invalid not jumpdest opcode.
         */
        InvalidJump: PlainDescriptor<undefined>;
        /**
         * Attempting to pop a value from an empty stack.
         */
        StackUnderflow: PlainDescriptor<undefined>;
        /**
         * Attempting to push a value onto a full stack.
         */
        StackOverflow: PlainDescriptor<undefined>;
        /**
         * Too much deposit was drawn from the shared txfee and deposit credit.
         *
         * This happens if the passed `gas` inside the ethereum transaction is too low.
         */
        TxFeeOverdraw: PlainDescriptor<undefined>;
        /**
         * When calling an EVM constructor `data` has to be empty.
         *
         * EVM constructors do not accept data. Their input data is part of the code blob itself.
         */
        EvmConstructorNonEmptyData: PlainDescriptor<undefined>;
        /**
         * Tried to construct an EVM contract via code hash.
         *
         * EVM contracts can only be instantiated via code upload as no initcode is
         * stored on-chain.
         */
        EvmConstructedFromHash: PlainDescriptor<undefined>;
        /**
         * The contract does not have enough balance to refund the storage deposit.
         *
         * This is a bug and should never happen. It means the accounting got out of sync.
         */
        StorageRefundNotEnoughFunds: PlainDescriptor<undefined>;
        /**
         * This means there are locks on the contracts storage deposit that prevents refunding it.
         *
         * This would be the case if the contract used its storage deposits for governance
         * or other pallets that allow creating locks over held balance.
         */
        StorageRefundLocked: PlainDescriptor<undefined>;
        /**
         * Called a pre-compile that is not allowed to be delegate called.
         *
         * Some pre-compile functions will trap the caller context if being delegate
         * called or if their caller was being delegate called.
         */
        PrecompileDelegateDenied: PlainDescriptor<undefined>;
        /**
         * ECDSA public key recovery failed. Most probably wrong recovery id or signature.
         */
        EcdsaRecoveryFailed: PlainDescriptor<undefined>;
        /**
         * Manual mapping is disabled when auto-mapping is enabled.
         */
        AutoMappingEnabled: PlainDescriptor<undefined>;
        /**
         * A contract cannot be created at this address: it still has uncleared
         * [`NativeDepositOf`] entries from a previously terminated contract that the deletion
         * queue has not yet drained.
         */
        PendingDepositCleanup: PlainDescriptor<undefined>;
    };
    DelegatedStaking: {
        /**
         * The account cannot perform this operation.
         */
        NotAllowed: PlainDescriptor<undefined>;
        /**
         * An existing staker cannot perform this action.
         */
        AlreadyStaking: PlainDescriptor<undefined>;
        /**
         * Reward Destination cannot be same as `Agent` account.
         */
        InvalidRewardDestination: PlainDescriptor<undefined>;
        /**
         * Delegation conditions are not met.
         *
         * Possible issues are
         * 1) Cannot delegate to self,
         * 2) Cannot delegate to multiple delegates.
         */
        InvalidDelegation: PlainDescriptor<undefined>;
        /**
         * The account does not have enough funds to perform the operation.
         */
        NotEnoughFunds: PlainDescriptor<undefined>;
        /**
         * Not an existing `Agent` account.
         */
        NotAgent: PlainDescriptor<undefined>;
        /**
         * Not a Delegator account.
         */
        NotDelegator: PlainDescriptor<undefined>;
        /**
         * Some corruption in internal state.
         */
        BadState: PlainDescriptor<undefined>;
        /**
         * Unapplied pending slash restricts operation on `Agent`.
         */
        UnappliedSlash: PlainDescriptor<undefined>;
        /**
         * `Agent` has no pending slash to be applied.
         */
        NothingToSlash: PlainDescriptor<undefined>;
        /**
         * Failed to withdraw amount from Core Staking.
         */
        WithdrawFailed: PlainDescriptor<undefined>;
        /**
         * Operation not supported by this pallet.
         */
        NotSupported: PlainDescriptor<undefined>;
    };
    AssetsFreezer: {
        /**
         * Number of freezes on an account would exceed `MaxFreezes`.
         */
        TooManyFreezes: PlainDescriptor<undefined>;
    };
    Oracle: {
        /**
         * The sender is not a member of the oracle and does not have
         * permission to feed data.
         */
        NoPermission: PlainDescriptor<undefined>;
        /**
         * The oracle member has already fed data in the current block.
         */
        AlreadyFeeded: PlainDescriptor<undefined>;
        /**
         * Exceeds the maximum number of `HasDispatched` size.
         */
        ExceedsMaxHasDispatchedSize: PlainDescriptor<undefined>;
    };
    MetaTx: {
        /**
         * Invalid proof (e.g. signature).
         */
        BadProof: PlainDescriptor<undefined>;
        /**
         * The meta transaction is not yet valid (e.g. nonce too high).
         */
        Future: PlainDescriptor<undefined>;
        /**
         * The meta transaction is outdated (e.g. nonce too low).
         */
        Stale: PlainDescriptor<undefined>;
        /**
         * The meta transactions's birth block is ancient.
         */
        AncientBirthBlock: PlainDescriptor<undefined>;
        /**
         * The transaction extension did not authorize any origin.
         */
        UnknownOrigin: PlainDescriptor<undefined>;
        /**
         * The meta transaction is invalid.
         */
        Invalid: PlainDescriptor<undefined>;
        /**
         * The meta transaction length is invalid.
         */
        InvalidLength: PlainDescriptor<undefined>;
    };
    MultiAssetBounties: {
        /**
         * No child-/bounty at that index.
         */
        InvalidIndex: PlainDescriptor<undefined>;
        /**
         * The reason given is just too big.
         */
        ReasonTooBig: PlainDescriptor<undefined>;
        /**
         * Invalid child-/bounty value.
         */
        InvalidValue: PlainDescriptor<undefined>;
        /**
         * The balance of the asset kind is not convertible to the balance of the native asset for
         * asserting the origin permissions.
         */
        FailedToConvertBalance: PlainDescriptor<undefined>;
        /**
         * The child-/bounty status is unexpected.
         */
        UnexpectedStatus: PlainDescriptor<undefined>;
        /**
         * Require child-/bounty curator.
         */
        RequireCurator: PlainDescriptor<undefined>;
        /**
         * The spend origin is valid but the amount it is allowed to spend is lower than the
         * requested amount.
         */
        InsufficientPermission: PlainDescriptor<undefined>;
        /**
         * There was issue with funding the child-/bounty.
         */
        FundingError: PlainDescriptor<undefined>;
        /**
         * There was issue with refunding the child-/bounty.
         */
        RefundError: PlainDescriptor<undefined>;
        /**
        
         */
        PayoutError: PlainDescriptor<undefined>;
        /**
         * Child-/bounty funding has not concluded yet.
         */
        FundingInconclusive: PlainDescriptor<undefined>;
        /**
         * Child-/bounty refund has not concluded yet.
         */
        RefundInconclusive: PlainDescriptor<undefined>;
        /**
         * Child-/bounty payout has not concluded yet.
         */
        PayoutInconclusive: PlainDescriptor<undefined>;
        /**
         * The child-/bounty or funding source account could not be derived from the indexes and
         * asset kind.
         */
        FailedToConvertSource: PlainDescriptor<undefined>;
        /**
         * The parent bounty cannot be closed because it has active child bounties.
         */
        HasActiveChildBounty: PlainDescriptor<undefined>;
        /**
         * Number of child bounties exceeds limit `MaxActiveChildBountyCount`.
         */
        TooManyChildBounties: PlainDescriptor<undefined>;
        /**
         * The parent bounty value is not enough to add new child-bounty.
         */
        InsufficientBountyValue: PlainDescriptor<undefined>;
        /**
         * The preimage does not exist.
         */
        PreimageNotExist: PlainDescriptor<undefined>;
    };
    AssetsPrecompilesPermit: {
        /**
         * The permit signature is invalid.
         */
        InvalidSignature: PlainDescriptor<undefined>;
        /**
         * The signer does not match the owner.
         */
        SignerMismatch: PlainDescriptor<undefined>;
        /**
         * The permit has expired (deadline passed).
         */
        PermitExpired: PlainDescriptor<undefined>;
        /**
         * The signature's `s` value is too high (malleability protection).
         */
        SignatureSValueTooHigh: PlainDescriptor<undefined>;
        /**
         * The signature's `v` value is invalid.
         */
        InvalidVValue: PlainDescriptor<undefined>;
        /**
         * Nonce overflow - account has used too many permits.
         */
        NonceOverflow: PlainDescriptor<undefined>;
        /**
         * The owner address is invalid (e.g., zero address).
         */
        InvalidOwner: PlainDescriptor<undefined>;
        /**
         * The spender address is invalid (e.g., zero address).
         */
        InvalidSpender: PlainDescriptor<undefined>;
    };
    RegistrarPara: {
        /**
         * The para id has not been reserved.
         */
        NotReserved: PlainDescriptor<undefined>;
        /**
         * The caller does not manage this para id.
         */
        NotOwner: PlainDescriptor<undefined>;
        /**
         * The para id is already registered, or a registration is already in flight for it.
         */
        AlreadyRegistered: PlainDescriptor<undefined>;
        /**
         * There is no registration in flight for this para id.
         */
        NotPending: PlainDescriptor<undefined>;
        /**
         * The manager may not abandon this registration yet.
         */
        CannotCancelYet: PlainDescriptor<undefined>;
        /**
         * The head data is larger than the relay chain will accept.
         */
        HeadDataTooLarge: PlainDescriptor<undefined>;
        /**
         * The validation code is larger than the relay chain will accept.
         */
        CodeTooLarge: PlainDescriptor<undefined>;
        /**
         * The validation code is smaller than the relay chain will accept.
         */
        CodeTooSmall: PlainDescriptor<undefined>;
        /**
         * The message could not be handed to the transport.
         */
        SendFailed: PlainDescriptor<undefined>;
        /**
         * There are no more para ids to hand out.
         */
        NoFreeParaId: PlainDescriptor<undefined>;
    };
    RegistrarRelay: {
        /**
         * No registration is waiting on code for this para id.
         */
        NothingPending: PlainDescriptor<undefined>;
        /**
         * The validation code does not match the hash the parachain committed to.
         */
        CodeHashMismatch: PlainDescriptor<undefined>;
        /**
         * The validation code is not the length the parachain committed to.
         */
        CodeLenMismatch: PlainDescriptor<undefined>;
        /**
         * The validation code is larger than this pallet will accept.
         */
        CodeTooLarge: PlainDescriptor<undefined>;
        /**
         * The message is not one this call serves.
         */
        UnexpectedMessage: PlainDescriptor<undefined>;
    };
};
type IConstants = {
    System: {
        /**
         * Block & extrinsics weights: base values and limits.
         */
        BlockWeights: PlainDescriptor<Anonymize<In7a38730s6qs>>;
        /**
         * The maximum length of a block (in bytes).
         */
        BlockLength: PlainDescriptor<Anonymize<Ibtil0ss5munbk>>;
        /**
         * Maximum number of block number to block hash mappings to keep (oldest pruned first).
         */
        BlockHashCount: PlainDescriptor<number>;
        /**
         * The weight of runtime database operations the runtime can invoke.
         */
        DbWeight: PlainDescriptor<Anonymize<I9s0ave7t0vnrk>>;
        /**
         * Get the chain's in-code version.
         */
        Version: PlainDescriptor<Anonymize<I4fo08joqmcqnm>>;
        /**
         * The designated SS58 prefix of this chain.
         *
         * This replaces the "ss58Format" property declared in the chain spec. Reason is
         * that the runtime should know about the prefix in order to make use of it as
         * an identifier of the chain.
         */
        SS58Prefix: PlainDescriptor<number>;
    };
    Utility: {
        /**
         * The limit on the number of batched calls.
         */
        batched_calls_limit: PlainDescriptor<number>;
    };
    Babe: {
        /**
         * The amount of time, in slots, that each epoch should last.
         * NOTE: Currently it is not possible to change the epoch duration after
         * the chain has started. Attempting to do so will brick block production.
         */
        EpochDuration: PlainDescriptor<bigint>;
        /**
         * The expected average block time at which BABE should be creating
         * blocks. Since BABE is probabilistic it is not trivial to figure out
         * what the expected average block time should be based on the slot
         * duration and the security parameter `c` (where `1 - c` represents
         * the probability of a slot being empty).
         */
        ExpectedBlockTime: PlainDescriptor<bigint>;
        /**
         * Max number of authorities allowed
         */
        MaxAuthorities: PlainDescriptor<number>;
        /**
         * The maximum number of nominators for each validator.
         */
        MaxNominators: PlainDescriptor<number>;
    };
    Timestamp: {
        /**
         * The minimum period between blocks.
         *
         * Be aware that this is different to the *expected* period that the block production
         * apparatus provides. Your chosen consensus system will generally work with this to
         * determine a sensible block time. For example, in the Aura pallet it will be double this
         * period on default settings.
         */
        MinimumPeriod: PlainDescriptor<bigint>;
    };
    Indices: {
        /**
         * The deposit needed for reserving an index.
         */
        Deposit: PlainDescriptor<bigint>;
    };
    Balances: {
        /**
         * The minimum amount required to keep an account open. MUST BE GREATER THAN ZERO!
         *
         * If you *really* need it to be zero, you can enable the feature `insecure_zero_ed` for
         * this pallet. However, you do so at your own risk: this will open up a major DoS vector.
         * In case you have multiple sources of provider references, you may also get unexpected
         * behaviour if you set this to zero.
         *
         * Bottom line: Do yourself a favour and make it at least one!
         */
        ExistentialDeposit: PlainDescriptor<bigint>;
        /**
         * The maximum number of locks that should exist on an account.
         * Not strictly enforced, but used for weight estimation.
         *
         * Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
         */
        MaxLocks: PlainDescriptor<number>;
        /**
         * The maximum number of named reserves that can exist on an account.
         *
         * Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
         */
        MaxReserves: PlainDescriptor<number>;
        /**
         * The maximum number of individual freeze locks that can exist on an account at any time.
         */
        MaxFreezes: PlainDescriptor<number>;
    };
    TransactionPayment: {
        /**
         * A fee multiplier for `Operational` extrinsics to compute "virtual tip" to boost their
         * `priority`
         *
         * This value is multiplied by the `final_fee` to obtain a "virtual tip" that is later
         * added to a tip component in regular `priority` calculations.
         * It means that a `Normal` transaction can front-run a similarly-sized `Operational`
         * extrinsic (with no tip), by including a tip value greater than the virtual tip.
         *
         * ```rust,ignore
         * // For `Normal`
         * let priority = priority_calc(tip);
         *
         * // For `Operational`
         * let virtual_tip = (inclusion_fee + tip) * OperationalFeeMultiplier;
         * let priority = priority_calc(tip + virtual_tip);
         * ```
         *
         * Note that since we use `final_fee` the multiplier applies also to the regular `tip`
         * sent with the transaction. So, not only does the transaction get a priority bump based
         * on the `inclusion_fee`, but we also amplify the impact of tips applied to `Operational`
         * transactions.
         */
        OperationalFeeMultiplier: PlainDescriptor<number>;
    };
    ElectionProviderMultiPhase: {
        /**
         * The minimum amount of improvement to the solution score that defines a solution as
         * "better" in the Signed phase.
         */
        BetterSignedThreshold: PlainDescriptor<number>;
        /**
         * The repeat threshold of the offchain worker.
         *
         * For example, if it is 5, that means that at least 5 blocks will elapse between attempts
         * to submit the worker's solution.
         */
        OffchainRepeat: PlainDescriptor<number>;
        /**
         * The priority of the unsigned transaction submitted in the unsigned-phase
         */
        MinerTxPriority: PlainDescriptor<bigint>;
        /**
         * Maximum number of signed submissions that can be queued.
         *
         * It is best to avoid adjusting this during an election, as it impacts downstream data
         * structures. In particular, `SignedSubmissionIndices<T>` is bounded on this value. If you
         * update this value during an election, you _must_ ensure that
         * `SignedSubmissionIndices.len()` is less than or equal to the new value. Otherwise,
         * attempts to submit new solutions may cause a runtime panic.
         */
        SignedMaxSubmissions: PlainDescriptor<number>;
        /**
         * Maximum weight of a signed solution.
         *
         * If [`Config::MinerConfig`] is being implemented to submit signed solutions (outside of
         * this pallet), then [`MinerConfig::solution_weight`] is used to compare against
         * this value.
         */
        SignedMaxWeight: PlainDescriptor<Anonymize<I4q39t5hn830vp>>;
        /**
         * The maximum amount of unchecked solutions to refund the call fee for.
         */
        SignedMaxRefunds: PlainDescriptor<number>;
        /**
         * Base reward for a signed solution
         */
        SignedRewardBase: PlainDescriptor<bigint>;
        /**
         * Per-byte deposit for a signed solution.
         */
        SignedDepositByte: PlainDescriptor<bigint>;
        /**
         * Per-weight deposit for a signed solution.
         */
        SignedDepositWeight: PlainDescriptor<bigint>;
        /**
         * Maximum number of winners that an election supports.
         *
         * Note: This must always be greater or equal to `T::DataProvider::desired_targets()`.
         */
        MaxWinners: PlainDescriptor<number>;
        /**
         * Maximum number of voters that can support a winner in an election solution.
         *
         * This is needed to ensure election computation is bounded.
         */
        MaxBackersPerWinner: PlainDescriptor<number>;
        /**
        
         */
        MinerMaxLength: PlainDescriptor<number>;
        /**
        
         */
        MinerMaxWeight: PlainDescriptor<Anonymize<I4q39t5hn830vp>>;
        /**
        
         */
        MinerMaxVotesPerVoter: PlainDescriptor<number>;
        /**
        
         */
        MinerMaxWinners: PlainDescriptor<number>;
    };
    Staking: {
        /**
         * Number of eras to keep in history.
         *
         * Following information is kept for eras in `[current_era -
         * HistoryDepth, current_era]`: `ErasStakers`, `ErasStakersClipped`,
         * `ErasValidatorPrefs`, `ErasValidatorReward`, `ErasRewardPoints`,
         * `ErasTotalStake`, `ErasStartSessionIndex`, `ClaimedRewards`, `ErasStakersPaged`,
         * `ErasStakersOverview`.
         *
         * Must be more than the number of eras delayed by session.
         * I.e. active era must always be in history. I.e. `active_era >
         * current_era - history_depth` must be guaranteed.
         *
         * If migrating an existing pallet from storage value to config value,
         * this should be set to same value or greater as in storage.
         *
         * Note: `HistoryDepth` is used as the upper bound for the `BoundedVec`
         * item `StakingLedger.legacy_claimed_rewards`. Setting this value lower than
         * the existing value can lead to inconsistencies in the
         * `StakingLedger` and will need to be handled properly in a migration.
         * The test `reducing_history_depth_abrupt` shows this effect.
         */
        HistoryDepth: PlainDescriptor<number>;
        /**
         * Number of sessions per era.
         */
        SessionsPerEra: PlainDescriptor<number>;
        /**
         * Number of eras that staked funds must remain bonded for.
         */
        BondingDuration: PlainDescriptor<number>;
        /**
         * Number of eras that slashes are deferred by, after computation.
         *
         * This should be less than the bonding duration. Set to 0 if slashes
         * should be applied immediately, without opportunity for intervention.
         */
        SlashDeferDuration: PlainDescriptor<number>;
        /**
         * The maximum size of each `T::ExposurePage`.
         *
         * An `ExposurePage` is weakly bounded to a maximum of `MaxExposurePageSize`
         * nominators.
         *
         * For older non-paged exposure, a reward payout was restricted to the top
         * `MaxExposurePageSize` nominators. This is to limit the i/o cost for the
         * nominator payout.
         *
         * Note: `MaxExposurePageSize` is used to bound `ClaimedRewards` and is unsafe to reduce
         * without handling it in a migration.
         */
        MaxExposurePageSize: PlainDescriptor<number>;
        /**
         * The absolute maximum of winner validators this pallet should return.
         */
        MaxValidatorSet: PlainDescriptor<number>;
        /**
         * The maximum number of `unlocking` chunks a [`StakingLedger`] can
         * have. Effectively determines how many unique eras a staker may be
         * unbonding in.
         *
         * Note: `MaxUnlockingChunks` is used as the upper bound for the
         * `BoundedVec` item `StakingLedger.unlocking`. Setting this value
         * lower than the existing value can lead to inconsistencies in the
         * `StakingLedger` and will need to be handled properly in a runtime
         * migration. The test `reducing_max_unlocking_chunks_abrupt` shows
         * this effect.
         */
        MaxUnlockingChunks: PlainDescriptor<number>;
    };
    Session: {
        /**
         * The amount to be held when setting keys.
         */
        KeyDeposit: PlainDescriptor<bigint>;
    };
    TechnicalCommittee: {
        /**
         * The maximum weight of a dispatch call that can be proposed and executed.
         */
        MaxProposalWeight: PlainDescriptor<Anonymize<I4q39t5hn830vp>>;
    };
    Grandpa: {
        /**
         * Max Authorities in use
         */
        MaxAuthorities: PlainDescriptor<number>;
        /**
         * The maximum number of nominators for each validator.
         */
        MaxNominators: PlainDescriptor<number>;
        /**
         * The maximum number of entries to keep in the set id to session index mapping.
         *
         * Since the `SetIdSession` map is only used for validating equivocations this
         * value should relate to the bonding duration of whatever staking system is
         * being used (if any). If equivocation handling is not enabled then this value
         * can be zero.
         */
        MaxSetIdSessionEntries: PlainDescriptor<bigint>;
    };
    Treasury: {
        /**
         * Period between successive spends.
         */
        SpendPeriod: PlainDescriptor<number>;
        /**
         * Percentage of spare funds (if any) that are burnt per spend period.
         */
        Burn: PlainDescriptor<number>;
        /**
         * The treasury's pallet id, used for deriving its sovereign account ID.
         */
        PalletId: PlainDescriptor<SizedHex<8>>;
        /**
         * DEPRECATED: associated with `spend_local` call and will be removed in May 2025.
         * Refer to <https://github.com/paritytech/polkadot-sdk/pull/5961> for migration to `spend`.
         *
         * The maximum number of approvals that can wait in the spending queue.
         *
         * NOTE: This parameter is also used within the Bounties Pallet extension if enabled.
         */
        MaxApprovals: PlainDescriptor<number>;
        /**
         * The period during which an approved treasury spend has to be claimed.
         */
        PayoutPeriod: PlainDescriptor<number>;
        /**
         * Gets this pallet's derived pot account.
         */
        pot_account: PlainDescriptor<SS58String>;
    };
    Contracts: {
        /**
         * Cost schedule and limits.
         */
        Schedule: PlainDescriptor<Anonymize<Ijc5n210o8bbf>>;
        /**
         * The amount of balance a caller has to pay for each byte of storage.
         *
         * # Note
         *
         * Changing this value for an existing chain might need a storage migration.
         */
        DepositPerByte: PlainDescriptor<bigint>;
        /**
         * Fallback value to limit the storage deposit if it's not being set by the caller.
         */
        DefaultDepositLimit: PlainDescriptor<bigint>;
        /**
         * The amount of balance a caller has to pay for each storage item.
         *
         * # Note
         *
         * Changing this value for an existing chain might need a storage migration.
         */
        DepositPerItem: PlainDescriptor<bigint>;
        /**
         * The percentage of the storage deposit that should be held for using a code hash.
         * Instantiating a contract, or calling [`chain_extension::Ext::lock_delegate_dependency`]
         * protects the code from being removed. In order to prevent abuse these actions are
         * protected with a percentage of the code deposit.
         */
        CodeHashLockupDepositPercent: PlainDescriptor<number>;
        /**
         * The maximum length of a contract code in bytes.
         *
         * The value should be chosen carefully taking into the account the overall memory limit
         * your runtime has, as well as the [maximum allowed callstack
         * depth](#associatedtype.CallStack). Look into the `integrity_test()` for some insights.
         */
        MaxCodeLen: PlainDescriptor<number>;
        /**
         * The maximum allowable length in bytes for storage keys.
         */
        MaxStorageKeyLen: PlainDescriptor<number>;
        /**
         * The maximum size of the transient storage in bytes.
         * This includes keys, values, and previous entries used for storage rollback.
         */
        MaxTransientStorageSize: PlainDescriptor<number>;
        /**
         * The maximum number of delegate_dependencies that a contract can lock with
         * [`chain_extension::Ext::lock_delegate_dependency`].
         */
        MaxDelegateDependencies: PlainDescriptor<number>;
        /**
         * Make contract callable functions marked as `#[unstable]` available.
         *
         * Contracts that use `#[unstable]` functions won't be able to be uploaded unless
         * this is set to `true`. This is only meant for testnets and dev nodes in order to
         * experiment with new features.
         *
         * # Warning
         *
         * Do **not** set to `true` on productions chains.
         */
        UnsafeUnstableInterface: PlainDescriptor<boolean>;
        /**
         * The maximum length of the debug buffer in bytes.
         */
        MaxDebugBufferLen: PlainDescriptor<number>;
        /**
         * Type that bundles together all the runtime configurable interface types.
         *
         * This is not a real config. We just mention the type here as constant so that
         * its type appears in the metadata. Only valid value is `()`.
         */
        Environment: PlainDescriptor<Anonymize<I3m5sq54sjdlso>>;
        /**
         * The version of the HostFn APIs that are available in the runtime.
         *
         * Only valid value is `()`.
         */
        ApiVersion: PlainDescriptor<number>;
    };
    ImOnline: {
        /**
         * A configuration for base priority of unsigned transactions.
         *
         * This is exposed so that it can be tuned for particular runtime, when
         * multiple pallets send unsigned transactions.
         */
        UnsignedPriority: PlainDescriptor<bigint>;
    };
    Identity: {
        /**
         * The amount held on deposit for a registered identity.
         */
        BasicDeposit: PlainDescriptor<bigint>;
        /**
         * The amount held on deposit per encoded byte for a registered identity.
         */
        ByteDeposit: PlainDescriptor<bigint>;
        /**
         * The amount held on deposit per registered username. This value should change only in
         * runtime upgrades with proper migration of existing deposits.
         */
        UsernameDeposit: PlainDescriptor<bigint>;
        /**
         * The amount held on deposit for a registered subaccount. This should account for the fact
         * that one storage item's value will increase by the size of an account ID, and there will
         * be another trie item whose value is the size of an account ID plus 32 bytes.
         */
        SubAccountDeposit: PlainDescriptor<bigint>;
        /**
         * The maximum number of sub-accounts allowed per identified account.
         */
        MaxSubAccounts: PlainDescriptor<number>;
        /**
         * Maximum number of registrars allowed in the system. Needed to bound the complexity
         * of, e.g., updating judgements.
         */
        MaxRegistrars: PlainDescriptor<number>;
        /**
         * The number of blocks within which a username grant must be accepted.
         */
        PendingUsernameExpiration: PlainDescriptor<number>;
        /**
         * The number of blocks that must pass to enable the permanent deletion of a username by
         * its respective authority.
         */
        UsernameGracePeriod: PlainDescriptor<number>;
        /**
         * The maximum length of a suffix.
         */
        MaxSuffixLength: PlainDescriptor<number>;
        /**
         * The maximum length of a username, including its suffix and any system-added delimiters.
         */
        MaxUsernameLength: PlainDescriptor<number>;
    };
    Recovery: {
        /**
         * Security deposit taken for each attempt that the initiator needs to place.
         */
        SecurityDeposit: PlainDescriptor<bigint>;
        /**
         * DO NOT REDUCE THIS VALUE. Maximum number of friends per account config.
         *
         * Reducing this value can cause decoding errors in the bounded vectors.
         */
        MaxFriendsPerConfig: PlainDescriptor<number>;
    };
    Vesting: {
        /**
         * The minimum amount transferred to call `vested_transfer`.
         */
        MinVestedTransfer: PlainDescriptor<bigint>;
        /**
        
         */
        MaxVestingSchedules: PlainDescriptor<number>;
    };
    Scheduler: {
        /**
         * The maximum weight that may be scheduled per block for any dispatchables.
         */
        MaximumWeight: PlainDescriptor<Anonymize<I4q39t5hn830vp>>;
        /**
         * The maximum number of scheduled calls in the queue for a single block.
         *
         * NOTE:
         * + Dependent pallets' benchmarks might require a higher limit for the setting. Set a
         * higher limit under `runtime-benchmarks` feature.
         */
        MaxScheduledPerBlock: PlainDescriptor<number>;
    };
    Proxy: {
        /**
         * The base amount of currency needed to reserve for creating a proxy.
         *
         * This is held for an additional storage item whose value size is
         * `sizeof(Balance)` bytes and whose key size is `sizeof(AccountId)` bytes.
         */
        ProxyDepositBase: PlainDescriptor<bigint>;
        /**
         * The amount of currency needed per proxy added.
         *
         * This is held for adding 32 bytes plus an instance of `ProxyType` more into a
         * pre-existing storage value. Thus, when configuring `ProxyDepositFactor` one should take
         * into account `32 + proxy_type.encode().len()` bytes of data.
         */
        ProxyDepositFactor: PlainDescriptor<bigint>;
        /**
         * The maximum amount of proxies allowed for a single account.
         */
        MaxProxies: PlainDescriptor<number>;
        /**
         * The maximum amount of time-delayed announcements that are allowed to be pending.
         */
        MaxPending: PlainDescriptor<number>;
        /**
         * The base amount of currency needed to reserve for creating an announcement.
         *
         * This is held when a new storage item holding a `Balance` is created (typically 16
         * bytes).
         */
        AnnouncementDepositBase: PlainDescriptor<bigint>;
        /**
         * The amount of currency needed per announcement made.
         *
         * This is held for adding an `AccountId`, `Hash` and `BlockNumber` (typically 68 bytes)
         * into a pre-existing storage value.
         */
        AnnouncementDepositFactor: PlainDescriptor<bigint>;
    };
    Multisig: {
        /**
         * The base amount of currency needed to reserve for creating a multisig execution or to
         * store a dispatch call for later.
         *
         * This is held for an additional storage item whose value size is
         * `4 + sizeof((BlockNumber, Balance, AccountId))` bytes and whose key size is
         * `32 + sizeof(AccountId)` bytes.
         */
        DepositBase: PlainDescriptor<bigint>;
        /**
         * The amount of currency needed per unit threshold when creating a multisig execution.
         *
         * This is held for adding 32 bytes more into a pre-existing storage value.
         */
        DepositFactor: PlainDescriptor<bigint>;
        /**
         * The maximum amount of signatories allowed in the multisig.
         */
        MaxSignatories: PlainDescriptor<number>;
    };
    Bounties: {
        /**
         * The amount held on deposit for placing a bounty proposal.
         */
        BountyDepositBase: PlainDescriptor<bigint>;
        /**
         * The delay period for which a bounty beneficiary need to wait before claim the payout.
         */
        BountyDepositPayoutDelay: PlainDescriptor<number>;
        /**
         * The time limit for a curator to act before a bounty expires.
         *
         * The period that starts when a curator is approved, during which they must execute or
         * update the bounty via `extend_bounty_expiry`. If missed, the bounty expires, and the
         * curator may be slashed. If `BlockNumberFor::MAX`, bounties stay active indefinitely,
         * removing the need for `extend_bounty_expiry`.
         */
        BountyUpdatePeriod: PlainDescriptor<number>;
        /**
         * The curator deposit is calculated as a percentage of the curator fee.
         *
         * This deposit has optional upper and lower bounds with `CuratorDepositMax` and
         * `CuratorDepositMin`.
         */
        CuratorDepositMultiplier: PlainDescriptor<number>;
        /**
         * Maximum amount of funds that should be placed in a deposit for making a proposal.
         */
        CuratorDepositMax: PlainDescriptor<Anonymize<I35p85j063s0il>>;
        /**
         * Minimum amount of funds that should be placed in a deposit for making a proposal.
         */
        CuratorDepositMin: PlainDescriptor<Anonymize<I35p85j063s0il>>;
        /**
         * Minimum value for a bounty.
         */
        BountyValueMinimum: PlainDescriptor<bigint>;
        /**
         * The amount held on deposit per byte within the tip report reason or bounty description.
         */
        DataDepositPerByte: PlainDescriptor<bigint>;
        /**
         * Maximum acceptable reason length.
         *
         * Benchmarks depend on this value, be sure to update weights file when changing this value
         */
        MaximumReasonLength: PlainDescriptor<number>;
    };
    Assets: {
        /**
         * Max number of items to destroy per `destroy_accounts` and `destroy_approvals` call.
         *
         * Must be configured to result in a weight that makes each call fit in a block.
         */
        RemoveItemsLimit: PlainDescriptor<number>;
        /**
         * The basic amount of funds that must be reserved for an asset.
         */
        AssetDeposit: PlainDescriptor<bigint>;
        /**
         * The amount of funds that must be reserved for a non-provider asset account to be
         * maintained.
         */
        AssetAccountDeposit: PlainDescriptor<bigint>;
        /**
         * The basic amount of funds that must be reserved when adding metadata to your asset.
         */
        MetadataDepositBase: PlainDescriptor<bigint>;
        /**
         * The additional funds that must be reserved for the number of bytes you store in your
         * metadata.
         */
        MetadataDepositPerByte: PlainDescriptor<bigint>;
        /**
         * The amount of funds that must be reserved when creating a new approval.
         */
        ApprovalDeposit: PlainDescriptor<bigint>;
        /**
         * The maximum length of a name or symbol stored on-chain.
         */
        StringLimit: PlainDescriptor<number>;
    };
    PoolAssets: {
        /**
         * Max number of items to destroy per `destroy_accounts` and `destroy_approvals` call.
         *
         * Must be configured to result in a weight that makes each call fit in a block.
         */
        RemoveItemsLimit: PlainDescriptor<number>;
        /**
         * The basic amount of funds that must be reserved for an asset.
         */
        AssetDeposit: PlainDescriptor<bigint>;
        /**
         * The amount of funds that must be reserved for a non-provider asset account to be
         * maintained.
         */
        AssetAccountDeposit: PlainDescriptor<bigint>;
        /**
         * The basic amount of funds that must be reserved when adding metadata to your asset.
         */
        MetadataDepositBase: PlainDescriptor<bigint>;
        /**
         * The additional funds that must be reserved for the number of bytes you store in your
         * metadata.
         */
        MetadataDepositPerByte: PlainDescriptor<bigint>;
        /**
         * The amount of funds that must be reserved when creating a new approval.
         */
        ApprovalDeposit: PlainDescriptor<bigint>;
        /**
         * The maximum length of a name or symbol stored on-chain.
         */
        StringLimit: PlainDescriptor<number>;
    };
    Beefy: {
        /**
         * The maximum number of authorities that can be added.
         */
        MaxAuthorities: PlainDescriptor<number>;
        /**
         * The maximum number of nominators for each validator.
         */
        MaxNominators: PlainDescriptor<number>;
        /**
         * The maximum number of entries to keep in the set id to session index mapping.
         *
         * Since the `SetIdSession` map is only used for validating equivocations this
         * value should relate to the bonding duration of whatever staking system is
         * being used (if any). If equivocation handling is not enabled then this value
         * can be zero.
         */
        MaxSetIdSessionEntries: PlainDescriptor<bigint>;
    };
    Lottery: {
        /**
         * The Lottery's pallet id
         */
        PalletId: PlainDescriptor<SizedHex<8>>;
        /**
         * The max number of calls available in a single lottery.
         */
        MaxCalls: PlainDescriptor<number>;
        /**
         * Number of time we should try to generate a random number that has no modulo bias.
         * The larger this number, the more potential computation is used for picking the winner,
         * but also the more likely that the chosen winner is done fairly.
         */
        MaxGenerateRandom: PlainDescriptor<number>;
    };
    Uniques: {
        /**
         * The basic amount of funds that must be reserved for collection.
         */
        CollectionDeposit: PlainDescriptor<bigint>;
        /**
         * The basic amount of funds that must be reserved for an item.
         */
        ItemDeposit: PlainDescriptor<bigint>;
        /**
         * The basic amount of funds that must be reserved when adding metadata to your item.
         */
        MetadataDepositBase: PlainDescriptor<bigint>;
        /**
         * The basic amount of funds that must be reserved when adding an attribute to an item.
         */
        AttributeDepositBase: PlainDescriptor<bigint>;
        /**
         * The additional funds that must be reserved for the number of bytes store in metadata,
         * either "normal" metadata or attribute metadata.
         */
        DepositPerByte: PlainDescriptor<bigint>;
        /**
         * The maximum length of data stored on-chain.
         */
        StringLimit: PlainDescriptor<number>;
        /**
         * The maximum length of an attribute key.
         */
        KeyLimit: PlainDescriptor<number>;
        /**
         * The maximum length of an attribute value.
         */
        ValueLimit: PlainDescriptor<number>;
    };
    Nfts: {
        /**
         * The basic amount of funds that must be reserved for collection.
         */
        CollectionDeposit: PlainDescriptor<bigint>;
        /**
         * The basic amount of funds that must be reserved for an item.
         */
        ItemDeposit: PlainDescriptor<bigint>;
        /**
         * The basic amount of funds that must be reserved when adding metadata to your item.
         */
        MetadataDepositBase: PlainDescriptor<bigint>;
        /**
         * The basic amount of funds that must be reserved when adding an attribute to an item.
         */
        AttributeDepositBase: PlainDescriptor<bigint>;
        /**
         * The additional funds that must be reserved for the number of bytes store in metadata,
         * either "normal" metadata or attribute metadata.
         */
        DepositPerByte: PlainDescriptor<bigint>;
        /**
         * The maximum length of data stored on-chain.
         */
        StringLimit: PlainDescriptor<number>;
        /**
         * The maximum length of an attribute key.
         */
        KeyLimit: PlainDescriptor<number>;
        /**
         * The maximum length of an attribute value.
         */
        ValueLimit: PlainDescriptor<number>;
        /**
         * The maximum approvals an item could have.
         */
        ApprovalsLimit: PlainDescriptor<number>;
        /**
         * The maximum attributes approvals an item could have.
         */
        ItemAttributesApprovalsLimit: PlainDescriptor<number>;
        /**
         * The max number of tips a user could send.
         */
        MaxTips: PlainDescriptor<number>;
        /**
         * The max duration in blocks for deadlines.
         */
        MaxDeadlineDuration: PlainDescriptor<number>;
        /**
         * The max number of attributes a user could set per call.
         */
        MaxAttributesPerCall: PlainDescriptor<number>;
        /**
         * Disables some of pallet's features.
         */
        Features: PlainDescriptor<bigint>;
    };
    NftFractionalization: {
        /**
         * The deposit paid by the user locking an NFT. The deposit is returned to the original NFT
         * owner when the asset is unified and the NFT is unlocked.
         */
        Deposit: PlainDescriptor<bigint>;
        /**
         * The pallet's id, used for deriving its sovereign account ID.
         */
        PalletId: PlainDescriptor<SizedHex<8>>;
        /**
         * The newly created asset's symbol.
         */
        NewAssetSymbol: PlainDescriptor<Uint8Array>;
        /**
         * The newly created asset's name.
         */
        NewAssetName: PlainDescriptor<Uint8Array>;
        /**
         * The maximum length of a name or symbol stored on-chain.
         */
        StringLimit: PlainDescriptor<number>;
    };
    TransactionStorage: {
        /**
         * Maximum number of indexed transactions in the block.
         */
        MaxBlockTransactions: PlainDescriptor<number>;
        /**
         * Maximum data set in a single transaction in bytes.
         */
        MaxTransactionSize: PlainDescriptor<number>;
    };
    VoterList: {
        /**
         * The list of thresholds separating the various bags.
         *
         * Ids are separated into unsorted bags according to their score. This specifies the
         * thresholds separating the bags. An id's bag is the largest bag for which the id's score
         * is less than or equal to its upper threshold.
         *
         * When ids are iterated, higher bags are iterated completely before lower bags. This means
         * that iteration is _semi-sorted_: ids of higher score tend to come before ids of lower
         * score, but peer ids within a particular bag are sorted in insertion order.
         *
         * # Expressing the constant
         *
         * This constant must be sorted in strictly increasing order. Duplicate items are not
         * permitted.
         *
         * There is an implied upper limit of `Score::MAX`; that value does not need to be
         * specified within the bag. For any two threshold lists, if one ends with
         * `Score::MAX`, the other one does not, and they are otherwise equal, the two
         * lists will behave identically.
         *
         * # Calculation
         *
         * It is recommended to generate the set of thresholds in a geometric series, such that
         * there exists some constant ratio such that `threshold[k + 1] == (threshold[k] *
         * constant_ratio).max(threshold[k] + 1)` for all `k`.
         *
         * The helpers in the `/utils/frame/generate-bags` module can simplify this calculation.
         *
         * # Examples
         *
         * - If `BagThresholds::get().is_empty()`, then all ids are put into the same bag, and
         * iteration is strictly in insertion order.
         * - If `BagThresholds::get().len() == 64`, and the thresholds are determined according to
         * the procedure given above, then the constant ratio is equal to 2.
         * - If `BagThresholds::get().len() == 200`, and the thresholds are determined according to
         * the procedure given above, then the constant ratio is approximately equal to 1.248.
         * - If the threshold list begins `[1, 2, 3, ...]`, then an id with score 0 or 1 will fall
         * into bag 0, an id with score 2 will fall into bag 1, etc.
         *
         * # Migration
         *
         * In the event that this list ever changes, a copy of the old bags list must be retained.
         * With that `List::migrate` can be called, which will perform the appropriate migration.
         */
        BagThresholds: PlainDescriptor<Anonymize<Iafqnechp3omqg>>;
        /**
         * Maximum number of accounts that may be re-bagged automatically in `on_idle`.
         *
         * A value of `0` (obtained by configuring `type MaxAutoRebagPerBlock = ();`) disables
         * the feature.
         */
        MaxAutoRebagPerBlock: PlainDescriptor<number>;
    };
    ChildBounties: {
        /**
         * Maximum number of child bounties that can be added to a parent bounty.
         */
        MaxActiveChildBountyCount: PlainDescriptor<number>;
        /**
         * Minimum value for a child-bounty.
         */
        ChildBountyValueMinimum: PlainDescriptor<bigint>;
    };
    NominationPools: {
        /**
         * The nomination pool's pallet id.
         */
        PalletId: PlainDescriptor<SizedHex<8>>;
        /**
         * The maximum pool points-to-balance ratio that an `open` pool can have.
         *
         * This is important in the event slashing takes place and the pool's points-to-balance
         * ratio becomes disproportional.
         *
         * Moreover, this relates to the `RewardCounter` type as well, as the arithmetic operations
         * are a function of number of points, and by setting this value to e.g. 10, you ensure
         * that the total number of points in the system are at most 10 times the total_issuance of
         * the chain, in the absolute worse case.
         *
         * For a value of 10, the threshold would be a pool points-to-balance ratio of 10:1.
         * Such a scenario would also be the equivalent of the pool being 90% slashed.
         */
        MaxPointsToBalance: PlainDescriptor<number>;
        /**
         * The maximum number of simultaneous unbonding chunks that can exist per member.
         */
        MaxUnbonding: PlainDescriptor<number>;
        /**
         * The maximum number of distinct era-keyed unbonding sub-pools ([`SubPools::with_era`])
         * that may exist at once. This is also the basis for how long each sub-pool is kept on
         * its own (correct) points-to-balance ratio: a sub-pool is merged into the era-agnostic
         * [`SubPools::no_era`] pool only after `MaxUnbondingPools - bonding_duration` eras
         * have passed since its unlock era (see `SubPools::maybe_merge_pools`). Once merged
         * the ratio can become skewed due to some slashed ratio getting merged in at some point.
         */
        MaxUnbondingPools: PlainDescriptor<number>;
    };
    AssetConversion: {
        /**
         * The fraction of every swap that the liquidity providers take as a fee.
         *
         * Used as the default swap fee for any pool that has no per-pool override set in
         * [`PoolFees`]. See [`Pallet::pool_fee`].
         */
        LPFee: PlainDescriptor<number>;
        /**
         * The maximum swap fee that can be set for a pool.
         */
        MaxSwapFee: PlainDescriptor<number>;
        /**
         * A one-time fee to setup the pool.
         */
        PoolSetupFee: PlainDescriptor<bigint>;
        /**
         * Asset class from [`Config::Assets`] used to pay the [`Config::PoolSetupFee`].
         */
        PoolSetupFeeAsset: PlainDescriptor<Anonymize<Ikjpbtmstl9nm>>;
        /**
         * A fee to withdraw the liquidity.
         */
        LiquidityWithdrawalFee: PlainDescriptor<number>;
        /**
         * The minimum LP token amount that could be minted. Ameliorates rounding errors.
         */
        MintMinLiquidity: PlainDescriptor<bigint>;
        /**
         * The max number of hops in a swap.
         */
        MaxSwapPathLength: PlainDescriptor<number>;
        /**
         * The pallet's id, used for deriving its sovereign account ID.
         */
        PalletId: PlainDescriptor<SizedHex<8>>;
    };
    FastUnstake: {
        /**
         * Deposit to take for unstaking, to make sure we're able to slash the it in order to cover
         * the costs of resources on unsuccessful unstake.
         */
        Deposit: PlainDescriptor<bigint>;
    };
    MessageQueue: {
        /**
         * The size of the page; this implies the maximum message size which can be sent.
         *
         * A good value depends on the expected message sizes, their weights, the weight that is
         * available for processing them and the maximal needed message size. The maximal message
         * size is slightly lower than this as defined by [`MaxMessageLenOf`].
         */
        HeapSize: PlainDescriptor<number>;
        /**
         * The maximum number of stale pages (i.e. of overweight messages) allowed before culling
         * can happen. Once there are more stale pages than this, then historical pages may be
         * dropped, even if they contain unprocessed overweight messages.
         */
        MaxStale: PlainDescriptor<number>;
        /**
         * The amount of weight (if any) which should be provided to the message queue for
         * servicing enqueued items `on_initialize`.
         *
         * This may be legitimately `None` in the case that you will call
         * `ServiceQueues::service_queues` manually or set [`Self::IdleMaxServiceWeight`] to have
         * it run in `on_idle`.
         */
        ServiceWeight: PlainDescriptor<Anonymize<Iasb8k6ash5mjn>>;
        /**
         * The maximum amount of weight (if any) to be used from remaining weight `on_idle` which
         * should be provided to the message queue for servicing enqueued items `on_idle`.
         * Useful for parachains to process messages at the same block they are received.
         *
         * If `None`, it will not call `ServiceQueues::service_queues` in `on_idle`.
         */
        IdleMaxServiceWeight: PlainDescriptor<Anonymize<Iasb8k6ash5mjn>>;
    };
    TxPause: {
        /**
         * Maximum length for pallet name and call name SCALE encoded string names.
         *
         * TOO LONG NAMES WILL BE TREATED AS PAUSED.
         */
        MaxNameLen: PlainDescriptor<number>;
    };
    SafeMode: {
        /**
         * For how many blocks the safe-mode will be entered by [`Pallet::enter`].
         */
        EnterDuration: PlainDescriptor<number>;
        /**
         * For how many blocks the safe-mode can be extended by each [`Pallet::extend`] call.
         *
         * This does not impose a hard limit as the safe-mode can be extended multiple times.
         */
        ExtendDuration: PlainDescriptor<number>;
        /**
         * The amount that will be reserved upon calling [`Pallet::enter`].
         *
         * `None` disallows permissionlessly enabling the safe-mode and is a sane default.
         */
        EnterDepositAmount: PlainDescriptor<Anonymize<I35p85j063s0il>>;
        /**
         * The amount that will be reserved upon calling [`Pallet::extend`].
         *
         * `None` disallows permissionlessly extending the safe-mode and is a sane default.
         */
        ExtendDepositAmount: PlainDescriptor<Anonymize<I35p85j063s0il>>;
        /**
         * The minimal duration a deposit will remain reserved after safe-mode is entered or
         * extended, unless [`Pallet::force_release_deposit`] is successfully called sooner.
         *
         * Every deposit is tied to a specific activation or extension, thus each deposit can be
         * released independently after the delay for it has passed.
         *
         * `None` disallows permissionlessly releasing the safe-mode deposits and is a sane
         * default.
         */
        ReleaseDelay: PlainDescriptor<Anonymize<I4arjljr6dpflb>>;
    };
    Statement: {
        /**
         * Min balance for priority statements.
         */
        StatementCost: PlainDescriptor<bigint>;
        /**
         * Cost of data byte used for priority calculation.
         */
        ByteCost: PlainDescriptor<bigint>;
        /**
         * Minimum number of statements allowed per account.
         */
        MinAllowedStatements: PlainDescriptor<number>;
        /**
         * Maximum number of statements allowed per account.
         */
        MaxAllowedStatements: PlainDescriptor<number>;
        /**
         * Minimum data bytes allowed per account.
         */
        MinAllowedBytes: PlainDescriptor<number>;
        /**
         * Maximum data bytes allowed per account.
         */
        MaxAllowedBytes: PlainDescriptor<number>;
    };
    MultiBlockMigrations: {
        /**
         * The maximal length of an encoded cursor.
         *
         * A good default needs to selected such that no migration will ever have a cursor with MEL
         * above this limit. This is statically checked in `integrity_test`.
         */
        CursorMaxLen: PlainDescriptor<number>;
        /**
         * The maximal length of an encoded identifier.
         *
         * A good default needs to selected such that no migration will ever have an identifier
         * with MEL above this limit. This is statically checked in `integrity_test`.
         */
        IdentifierMaxLen: PlainDescriptor<number>;
    };
    Broker: {
        /**
         * Identifier from which the internal Pot is generated.
         */
        PalletId: PlainDescriptor<SizedHex<8>>;
        /**
         * Number of Relay-chain blocks per timeslice.
         */
        TimeslicePeriod: PlainDescriptor<number>;
        /**
         * Maximum number of legacy leases.
         */
        MaxLeasedCores: PlainDescriptor<number>;
        /**
         * Maximum number of system cores.
         */
        MaxReservedCores: PlainDescriptor<number>;
        /**
         * Given that we are performing all auto-renewals in a single block, it has to be limited.
         */
        MaxAutoRenewals: PlainDescriptor<number>;
        /**
         * The smallest amount of credits a user can purchase.
         *
         * Needed to prevent spam attacks.
         */
        MinimumCreditPurchase: PlainDescriptor<bigint>;
    };
    Mixnet: {
        /**
         * The maximum number of authorities per session.
         */
        MaxAuthorities: PlainDescriptor<number>;
        /**
         * The maximum size of one of a mixnode's external addresses.
         */
        MaxExternalAddressSize: PlainDescriptor<number>;
        /**
         * The maximum number of external addresses for a mixnode.
         */
        MaxExternalAddressesPerMixnode: PlainDescriptor<number>;
        /**
         * Length of the first phase of each session (`CoverToCurrent`), in blocks.
         */
        NumCoverToCurrentBlocks: PlainDescriptor<number>;
        /**
         * Length of the second phase of each session (`RequestsToCurrent`), in blocks.
         */
        NumRequestsToCurrentBlocks: PlainDescriptor<number>;
        /**
         * Length of the third phase of each session (`CoverToPrev`), in blocks.
         */
        NumCoverToPrevBlocks: PlainDescriptor<number>;
        /**
         * The number of "slack" blocks at the start of each session, during which
         * [`maybe_register`](Pallet::maybe_register) will not attempt to post registration
         * transactions.
         */
        NumRegisterStartSlackBlocks: PlainDescriptor<number>;
        /**
         * The number of "slack" blocks at the end of each session.
         * [`maybe_register`](Pallet::maybe_register) will try to register before this slack
         * period, but may post registration transactions during the slack period as a last
         * resort.
         */
        NumRegisterEndSlackBlocks: PlainDescriptor<number>;
        /**
         * Priority of unsigned transactions used to register mixnodes.
         */
        RegistrationPriority: PlainDescriptor<bigint>;
        /**
         * Minimum number of mixnodes. If there are fewer than this many mixnodes registered for a
         * session, the mixnet will not be active during the session.
         */
        MinMixnodes: PlainDescriptor<number>;
    };
    Revive: {
        /**
         * The amount of balance a caller has to pay for each byte of storage.
         *
         * # Note
         *
         * It is safe to change this value on a live chain as all refunds are pro rata.
         */
        DepositPerByte: PlainDescriptor<bigint>;
        /**
         * The amount of balance a caller has to pay for each storage item.
         *
         * # Note
         *
         * It is safe to change this value on a live chain as all refunds are pro rata.
         */
        DepositPerItem: PlainDescriptor<bigint>;
        /**
         * The amount of balance a caller has to pay for each child trie storage item.
         *
         * Those are the items created by a contract. In Solidity each value is a single
         * storage item. This is why we need to set a lower value here than for the main
         * trie items. Otherwise the storage deposit is too high.
         *
         * # Note
         *
         * It is safe to change this value on a live chain as all refunds are pro rata.
         */
        DepositPerChildTrieItem: PlainDescriptor<bigint>;
        /**
         * The percentage of the storage deposit that should be held for using a code hash.
         * Instantiating a contract, protects the code from being removed. In order to prevent
         * abuse these actions are protected with a percentage of the code deposit.
         */
        CodeHashLockupDepositPercent: PlainDescriptor<number>;
        /**
         * Allow EVM bytecode to be uploaded and instantiated.
         */
        AllowEVMBytecode: PlainDescriptor<boolean>;
        /**
         * The [EIP-155](https://eips.ethereum.org/EIPS/eip-155) chain ID.
         *
         * This is a unique identifier assigned to each blockchain network,
         * preventing replay attacks.
         */
        ChainId: PlainDescriptor<bigint>;
        /**
         * The ratio between the decimal representation of the native token and the ETH token.
         */
        NativeToEthRatio: PlainDescriptor<number>;
        /**
         * The fraction the maximum extrinsic weight `eth_transact` extrinsics are capped to.
         *
         * This is not a security measure but a requirement due to how we map gas to `(Weight,
         * StorageDeposit)`. The mapping might derive a `Weight` that is too large to fit into an
         * extrinsic. In this case we cap it to the limit specified here.
         *
         * `eth_transact` transactions that use more weight than specified will fail with an out of
         * gas error during execution. Larger fractions will allow more transactions to run.
         * Smaller values waste less block space: Choose as small as possible and as large as
         * necessary.
         *
         * Default: `0.5`.
         */
        MaxEthExtrinsicWeight: PlainDescriptor<bigint>;
        /**
         * Allows debug-mode configuration, such as enabling unlimited contract size.
         */
        DebugEnabled: PlainDescriptor<boolean>;
        /**
         * When enabled, accounts are automatically mapped on creation and unmapped on
         * kill via [`AutoMapper`]. This removes the need for explicit `map_account` calls.
         *
         * Requires `frame_system::Config::OnNewAccount` and `OnKilledAccount` to be set
         * to [`AutoMapper`]. When enabled, the `map_account` and `unmap_account`
         * dispatchables are disabled.
         */
        AutoMap: PlainDescriptor<boolean>;
        /**
         * This determines the relative scale of our gas price and gas estimates.
         *
         * By default, the gas price (in wei) is `FeeInfo::next_fee_multiplier()` multiplied by
         * `NativeToEthRatio`. `GasScale` allows to scale this value: the actual gas price is the
         * default gas price multiplied by `GasScale`.
         *
         * As a consequence, gas cost (gas estimates and actual gas usage during transaction) is
         * scaled down by the same factor. Thus, the total transaction cost is not affected by
         * `GasScale` – apart from rounding differences: the transaction cost is always a multiple
         * of the gas price and is derived by rounded up, so that with higher `GasScales` this can
         * lead to higher gas cost as the rounding difference would be larger.
         *
         * The main purpose of changing the `GasScale` is to tune the gas cost so that it is closer
         * to standard EVM gas cost and contracts will not run out of gas when tools or code
         * assume hard coded gas limits.
         *
         * Requirement: `GasScale` must not be 0
         */
        GasScale: PlainDescriptor<number>;
    };
    DelegatedStaking: {
        /**
         * Injected identifier for the pallet.
         */
        PalletId: PlainDescriptor<SizedHex<8>>;
        /**
         * Fraction of the slash that is rewarded to the caller of pending slash to the agent.
         */
        SlashRewardFraction: PlainDescriptor<number>;
    };
    Oracle: {
        /**
         * The pallet ID.
         *
         * Will be used to derive the pallet's account, which is used as the oracle account
         * when values are fed by root.
         */
        PalletId: PlainDescriptor<SizedHex<8>>;
        /**
         * The maximum number of oracle operators that can feed data in a single block.
         */
        MaxHasDispatchedSize: PlainDescriptor<number>;
        /**
         * The maximum number of key-value pairs that can be submitted in a single extrinsic.
         */
        MaxFeedValues: PlainDescriptor<number>;
    };
    MultiAssetBounties: {
        /**
         * Minimum value for a bounty.
         */
        BountyValueMinimum: PlainDescriptor<bigint>;
        /**
         * Minimum value for a child-bounty.
         */
        ChildBountyValueMinimum: PlainDescriptor<bigint>;
        /**
         * Maximum number of child bounties that can be added to a parent bounty.
         */
        MaxActiveChildBountyCount: PlainDescriptor<number>;
    };
    AssetsPrecompilesPermit: {
        /**
         * The chain ID used in EIP-712 domain separator.
         */
        ChainId: PlainDescriptor<bigint>;
    };
    RegistrarPara: {
        /**
         * The lowest para id this pallet will hand out.
         *
         * Mirrors the relay chain's `LOWEST_PUBLIC_ID`. Ids below it are reserved for system
         * parachains and are not obtainable here.
         */
        FirstPublicParaId: PlainDescriptor<number>;
        /**
         * The smallest validation code the relay chain will accept.
         *
         * A local mirror of the relay chain's `MIN_CODE_SIZE`, used to fail early. The relay
         * chain checks the real thing against its own live configuration.
         */
        MinCodeSize: PlainDescriptor<number>;
        /**
         * The largest validation code the relay chain will accept.
         *
         * A local mirror of the relay chain's `max_code_size`. See [`Config::MinCodeSize`].
         */
        MaxCodeSize: PlainDescriptor<number>;
        /**
         * The largest head data the relay chain will accept.
         *
         * A local mirror of the relay chain's `max_head_data_size`. See [`Config::MinCodeSize`].
         */
        MaxHeadDataSize: PlainDescriptor<number>;
        /**
         * How long a manager waits for the relay chain before giving up on a registration.
         *
         * Measured in [`Config::BlockNumberProvider`] blocks. Should comfortably cover a round
         * trip, so that a verdict that is merely slow lands before anybody tries to cancel.
         */
        PendingDeadline: PlainDescriptor<number>;
    };
    RegistrarRelay: {
        /**
         * The largest head data this pallet will hold onto while waiting for code.
         *
         * Should be at least the relay chain's `max_head_data_size`.
         */
        MaxHeadDataSize: PlainDescriptor<number>;
        /**
         * The largest validation code [`Pallet::apply_authorized_code`] will accept.
         *
         * Should be at least the relay chain's `max_code_size`.
         */
        MaxCodeSize: PlainDescriptor<number>;
        /**
         * How many registrations may be waiting on their code at once.
         *
         * Bounds the head data this pallet stores while no deposit is held here. Entries only ever
         * leave by the code landing or by the parachain cancelling, so a manager who does neither
         * occupies a slot for as long as they keep paying the deposit on the parachain.
         */
        MaxPendingRegistrations: PlainDescriptor<number>;
        /**
         * Priority given to a valid [`Pallet::apply_authorized_code`] in the transaction pool.
         */
        UnsignedPriority: PlainDescriptor<bigint>;
    };
};
type IViewFns = {
    Recovery: {
        /**
         * The provided block number that will be used to measure time.
         */
        provided_block_number: RuntimeDescriptor<[], number>;
        /**
         * The friend groups of an account that can initiate recovery attempts.
         */
        friend_groups: RuntimeDescriptor<[lost: SS58String], Anonymize<I4sut8eue4ivos>>;
        /**
         * Ongoing recovery attempts for a lost account.
         */
        attempts: RuntimeDescriptor<[lost: SS58String], Anonymize<Ifl19kf0ds243k>>;
        /**
         * The account that inherited full access to the lost account.
         */
        inheritor: RuntimeDescriptor<[lost: SS58String], Anonymize<Ihfphjolmsqq1>>;
        /**
         * All the recovered accounts that `heir` inherited access to.
         */
        inheritance: RuntimeDescriptor<[heir: SS58String], Anonymize<Ia2lhg7l2hilo3>>;
    };
    Proxy: {
        /**
         * Check if a `RuntimeCall` is allowed for a given `ProxyType`.
         */
        check_permissions: RuntimeDescriptor<[call: Anonymize<I2t2hv6jbqq8q3>, proxy_type: Anonymize<I1bpip5bh5877p>], boolean>;
        /**
         * Check if one `ProxyType` is a subset of another `ProxyType`.
         */
        is_superset: RuntimeDescriptor<[to_check: Anonymize<I1bpip5bh5877p>, against: Anonymize<I1bpip5bh5877p>], boolean>;
    };
    Assets: {
        /**
         * Provide the asset details for asset `id`.
         */
        asset_details: RuntimeDescriptor<[id: number], Anonymize<I6052turo9tavh>>;
        /**
         * Provide the balance of `who` for asset `id`.
         */
        balance_of: RuntimeDescriptor<[who: SS58String, id: number], Anonymize<I35p85j063s0il>>;
        /**
         * Provide the configured metadata for asset `id`.
         */
        get_metadata: RuntimeDescriptor<[id: number], Anonymize<Iemk0s5gdc9ruv>>;
        /**
         * Provide the configured reserves data for asset `id`.
         */
        get_reserves_data: RuntimeDescriptor<[id: number], Anonymize<I35l6p7kq19mr0>>;
    };
    PoolAssets: {
        /**
         * Provide the asset details for asset `id`.
         */
        asset_details: RuntimeDescriptor<[id: number], Anonymize<I6052turo9tavh>>;
        /**
         * Provide the balance of `who` for asset `id`.
         */
        balance_of: RuntimeDescriptor<[who: SS58String, id: number], Anonymize<I35p85j063s0il>>;
        /**
         * Provide the configured metadata for asset `id`.
         */
        get_metadata: RuntimeDescriptor<[id: number], Anonymize<Iemk0s5gdc9ruv>>;
        /**
         * Provide the configured reserves data for asset `id`.
         */
        get_reserves_data: RuntimeDescriptor<[id: number], Anonymize<I35l6p7kq19mr0>>;
    };
    VoterList: {
        /**
         * Get the current `score` of a given account.
         *
         * Returns `(current, real_score)`, the former being the current score that this pallet is
         * aware of, which may or may not be up to date, and the latter being the real score, as
         * provided by
         * If the two differ, it means this node is eligible for [`Call::rebag`].
         */
        scores: RuntimeDescriptor<[who: SS58String], Anonymize<Iba6ec6u9n2dc1>>;
    };
    AssetConversion: {
        /**
         * Returns the balance of each asset in the pool.
         * The tuple result is in the order requested (not necessarily the same as pool order).
         */
        get_reserves: RuntimeDescriptor<[asset1: Anonymize<Ikjpbtmstl9nm>, asset2: Anonymize<Ikjpbtmstl9nm>], Anonymize<I9q7jcg05t1hem>>;
        /**
         * Gets a quote for swapping an exact amount of `asset1` for `asset2`.
         *
         * If `include_fee` is true, the quote will include the liquidity provider fee.
         * If the pool does not exist or has no liquidity, `None` is returned.
         * Note that the price may have changed by the time the transaction is executed.
         * (Use `amount_out_min` to control slippage.)
         * Returns `Some(quoted_amount)` on success.
         */
        quote_price_exact_tokens_for_tokens: RuntimeDescriptor<[asset1: Anonymize<Ikjpbtmstl9nm>, asset2: Anonymize<Ikjpbtmstl9nm>, amount: bigint, include_fee: boolean], Anonymize<I35p85j063s0il>>;
        /**
         * Gets a quote for swapping `amount` of `asset1` for an exact amount of `asset2`.
         *
         * If `include_fee` is true, the quote will include the liquidity provider fee.
         * If the pool does not exist or has no liquidity, `None` is returned.
         * Note that the price may have changed by the time the transaction is executed.
         * (Use `amount_in_max` to control slippage.)
         * Returns `Some(quoted_amount)` on success.
         */
        quote_price_tokens_for_exact_tokens: RuntimeDescriptor<[asset1: Anonymize<Ikjpbtmstl9nm>, asset2: Anonymize<Ikjpbtmstl9nm>, amount: bigint, include_fee: boolean], Anonymize<I35p85j063s0il>>;
    };
    MultiBlockMigrations: {
        /**
         * Returns the ongoing status of migrations.
         */
        ongoing_status: RuntimeDescriptor<[], Anonymize<I9vodnt2k1kha>>;
        /**
         * Returns progress information about the current migration, if any.
         *
         * This function provides detailed information about the current migration's progress,
         * including the number of steps completed and the maximum allowed steps.
         */
        progress: RuntimeDescriptor<[], Anonymize<I4ao1le27fcisl>>;
        /**
         * Returns the storage prefixes affected by the current migration.
         *
         * Can be empty if the migration does not know or there are no prefixes.
         */
        affected_prefixes: RuntimeDescriptor<[], Anonymize<Itom7fk49o0c9>>;
        /**
         * Returns the comprehensive status of multi-block migrations.
         */
        status: RuntimeDescriptor<[], Anonymize<Ih4ursllob8fg>>;
    };
    Oracle: {
        /**
         * Retrieve the aggregated oracle value for a specific key, including its timestamp.
         */
        get_value: RuntimeDescriptor<[key: number], Anonymize<I974rv7q5bvln8>>;
        /**
         * Retrieve every aggregated oracle value tracked by the pallet.
         */
        all_values: RuntimeDescriptor<[], Anonymize<I7oh7gneaur84>>;
    };
};
type IRuntimeCalls = {
    /**
     * The `Core` runtime api that every Substrate runtime needs to implement.
     */
    Core: {
        /**
         * Returns the version of the runtime.
         */
        version: RuntimeDescriptor<[], Anonymize<I4fo08joqmcqnm>>;
        /**
         * Execute the given block.
         */
        execute_block: RuntimeDescriptor<[block: Anonymize<Iaqet9jc3ihboe>], undefined>;
        /**
         * Initialize a block with the given header and return the runtime executive mode.
         */
        initialize_block: RuntimeDescriptor<[header: Anonymize<Ic952bubvq4k7d>], Anonymize<I2v50gu3s1aqk6>>;
    };
    /**
     * The `Metadata` api trait that returns metadata for the runtime.
     */
    Metadata: {
        /**
         * Returns the metadata of a runtime.
         */
        metadata: RuntimeDescriptor<[], Uint8Array>;
        /**
         * Returns the metadata at a given version.
         *
         * If the given `version` isn't supported, this will return `None`.
         * Use [`Self::metadata_versions`] to find out about supported metadata version of the runtime.
         */
        metadata_at_version: RuntimeDescriptor<[version: number], Anonymize<Iabpgqcjikia83>>;
        /**
         * Returns the supported metadata versions.
         *
         * This can be used to call `metadata_at_version`.
         */
        metadata_versions: RuntimeDescriptor<[], Anonymize<Icgljjb6j82uhn>>;
    };
    /**
     * Runtime API for executing view functions
     */
    RuntimeViewFunction: {
        /**
         * Execute a view function query.
         */
        execute_view_function: RuntimeDescriptor<[query_id: Anonymize<I4gil44d08grh>, input: Uint8Array], Anonymize<I7u915mvkdsb08>>;
    };
    /**
     * The `BlockBuilder` api trait that provides the required functionality for building a block.
     */
    BlockBuilder: {
        /**
         * Apply the given extrinsic.
         *
         * Returns an inclusion outcome which specifies if this extrinsic is included in
         * this block or not.
         */
        apply_extrinsic: RuntimeDescriptor<[extrinsic: Uint8Array], Anonymize<Icscp8b58b21dm>>;
        /**
         * Finish the current block.
         */
        finalize_block: RuntimeDescriptor<[], Anonymize<Ic952bubvq4k7d>>;
        /**
         * Generate inherent extrinsics. The inherent data will vary from chain to chain.
         */
        inherent_extrinsics: RuntimeDescriptor<[inherent: Anonymize<If7uv525tdvv7a>], Anonymize<Itom7fk49o0c9>>;
        /**
         * Check that the inherents are valid. The inherent data will vary from chain to chain.
         */
        check_inherents: RuntimeDescriptor<[block: Anonymize<Iaqet9jc3ihboe>, data: Anonymize<If7uv525tdvv7a>], Anonymize<I2an1fs2eiebjp>>;
    };
    /**
     * The `TaggedTransactionQueue` api trait for interfering with the transaction queue.
     */
    TaggedTransactionQueue: {
        /**
         * Validate the transaction.
         *
         * This method is invoked by the transaction pool to learn details about given transaction.
         * The implementation should make sure to verify the correctness of the transaction
         * against current state. The given `block_hash` corresponds to the hash of the block
         * that is used as current state.
         *
         * Note that this call may be performed by the pool multiple times and transactions
         * might be verified in any possible order.
         */
        validate_transaction: RuntimeDescriptor<[source: TransactionValidityTransactionSource, tx: Uint8Array, block_hash: SizedHex<32>], Anonymize<I9ask1o4tfvcvs>>;
    };
    /**
     * The offchain worker api.
     */
    OffchainWorkerApi: {
        /**
         * Starts the off-chain task for given block header.
         */
        offchain_worker: RuntimeDescriptor<[header: Anonymize<Ic952bubvq4k7d>], undefined>;
    };
    /**
     * APIs for integrating the GRANDPA finality gadget into runtimes.
     * This should be implemented on the runtime side.
     *
     * This is primarily used for negotiating authority-set changes for the
     * gadget. GRANDPA uses a signaling model of changing authority sets:
     * changes should be signaled with a delay of N blocks, and then automatically
     * applied in the runtime after those N blocks have passed.
     *
     * The consensus protocol will coordinate the handoff externally.
     */
    GrandpaApi: {
        /**
         * Get the current GRANDPA authorities and weights. This should not change except
         * for when changes are scheduled and the corresponding delay has passed.
         *
         * When called at block B, it will return the set of authorities that should be
         * used to finalize descendants of this block (B+1, B+2, ...). The block B itself
         * is finalized by the authorities from block B-1.
         */
        grandpa_authorities: RuntimeDescriptor<[], Anonymize<I3geksg000c171>>;
        /**
         * Submits an unsigned extrinsic to report an equivocation. The caller
         * must provide the equivocation proof and a key ownership proof
         * (should be obtained using `generate_key_ownership_proof`). The
         * extrinsic will be unsigned and should only be accepted for local
         * authorship (not to be broadcast to the network). This method returns
         * `None` when creation of the extrinsic fails, e.g. if equivocation
         * reporting is disabled for the given runtime (i.e. this method is
         * hardcoded to return `None`). Only useful in an offchain context.
         */
        submit_report_equivocation_unsigned_extrinsic: RuntimeDescriptor<[equivocation_proof: Anonymize<I9puqgoda8ofk4>, key_owner_proof: Uint8Array], boolean>;
        /**
         * Generates a proof of key ownership for the given authority in the
         * given set. An example usage of this module is coupled with the
         * session historical module to prove that a given authority key is
         * tied to a given staking identity during a specific session. Proofs
         * of key ownership are necessary for submitting equivocation reports.
         * NOTE: even though the API takes a `set_id` as parameter the current
         * implementations ignore this parameter and instead rely on this
         * method being called at the correct block height, i.e. any point at
         * which the given set id is live on-chain. Future implementations will
         * instead use indexed data through an offchain worker, not requiring
         * older states to be available.
         */
        generate_key_ownership_proof: RuntimeDescriptor<[set_id: bigint, authority_id: SizedHex<32>], Anonymize<Iabpgqcjikia83>>;
        /**
         * Get current GRANDPA authority set id.
         */
        current_set_id: RuntimeDescriptor<[], bigint>;
    };
    /**
     * Runtime api for accessing information about nomination pools.
     */
    NominationPoolsApi: {
        /**
         * Returns the pending rewards for the member that the AccountId was given for.
         */
        pending_rewards: RuntimeDescriptor<[who: SS58String], bigint>;
        /**
         * Returns the equivalent balance of `points` for a given pool.
         */
        points_to_balance: RuntimeDescriptor<[pool_id: number, points: bigint], bigint>;
        /**
         * Returns the equivalent points of `new_funds` for a given pool.
         */
        balance_to_points: RuntimeDescriptor<[pool_id: number, new_funds: bigint], bigint>;
        /**
         * Returns the pending slash for a given pool.
         */
        pool_pending_slash: RuntimeDescriptor<[pool_id: number], bigint>;
        /**
         * Returns the pending slash for a given pool member.
         *
         * If pending slash of the member exceeds `ExistentialDeposit`, it can be reported on
         * chain.
         */
        member_pending_slash: RuntimeDescriptor<[member: SS58String], bigint>;
        /**
         * Returns true if the pool with `pool_id` needs migration.
         *
         * This can happen when the `pallet-nomination-pools` has switched to using strategy
         * [`DelegateStake`](pallet_nomination_pools::adapter::DelegateStake) but the pool
         * still has funds that were staked using the older strategy
         * [TransferStake](pallet_nomination_pools::adapter::TransferStake). Use
         * [`migrate_pool_to_delegate_stake`](pallet_nomination_pools::Call::migrate_pool_to_delegate_stake)
         * to migrate the pool.
         */
        pool_needs_delegate_migration: RuntimeDescriptor<[pool_id: number], boolean>;
        /**
         * Returns true if the delegated funds of the pool `member` needs migration.
         *
         * Once a pool has successfully migrated to the strategy
         * [`DelegateStake`](pallet_nomination_pools::adapter::DelegateStake), the funds of the
         * member can be migrated from pool account to the member's account. Use
         * [`migrate_delegation`](pallet_nomination_pools::Call::migrate_delegation)
         * to migrate the funds of the pool member.
         */
        member_needs_delegate_migration: RuntimeDescriptor<[member: SS58String], boolean>;
        /**
         * Returns the total contribution of a pool member including any balance that is unbonding.
         */
        member_total_balance: RuntimeDescriptor<[who: SS58String], bigint>;
        /**
         * Total balance contributed to the pool.
         */
        pool_balance: RuntimeDescriptor<[pool_id: number], bigint>;
        /**
         * Returns the bonded account and reward account associated with the pool_id.
         */
        pool_accounts: RuntimeDescriptor<[pool_id: number], Anonymize<I2na29tt2afp0j>>;
    };
    /**
    
     */
    StakingApi: {
        /**
         * Returns the nominations quota for a nominator with a given balance.
         */
        nominations_quota: RuntimeDescriptor<[balance: bigint], number>;
        /**
         * Returns the page count of exposures for a validator `account` in a given era.
         */
        eras_stakers_page_count: RuntimeDescriptor<[era: number, account: SS58String], number>;
        /**
         * Returns true if a validator `account` has pages to be claimed for the given era.
         */
        pending_rewards: RuntimeDescriptor<[era: number, account: SS58String], boolean>;
    };
    /**
     * API necessary for block authorship with BABE.
     */
    BabeApi: {
        /**
         * Return the configuration for BABE.
         */
        configuration: RuntimeDescriptor<[], Anonymize<Iems84l8lk2v0c>>;
        /**
         * Returns the slot that started the current epoch.
         */
        current_epoch_start: RuntimeDescriptor<[], bigint>;
        /**
         * Returns information regarding the current epoch.
         */
        current_epoch: RuntimeDescriptor<[], Anonymize<I1r5ke30ueqo0r>>;
        /**
         * Returns information regarding the next epoch (which was already
         * previously announced).
         */
        next_epoch: RuntimeDescriptor<[], Anonymize<I1r5ke30ueqo0r>>;
        /**
         * Generates a proof of key ownership for the given authority in the
         * current epoch. An example usage of this module is coupled with the
         * session historical module to prove that a given authority key is
         * tied to a given staking identity during a specific session. Proofs
         * of key ownership are necessary for submitting equivocation reports.
         * NOTE: even though the API takes a `slot` as parameter the current
         * implementations ignores this parameter and instead relies on this
         * method being called at the correct block height, i.e. any point at
         * which the epoch for the given slot is live on-chain. Future
         * implementations will instead use indexed data through an offchain
         * worker, not requiring older states to be available.
         */
        generate_key_ownership_proof: RuntimeDescriptor<[slot: bigint, authority_id: SizedHex<32>], Anonymize<Iabpgqcjikia83>>;
        /**
         * Submits an unsigned extrinsic to report an equivocation. The caller
         * must provide the equivocation proof and a key ownership proof
         * (should be obtained using `generate_key_ownership_proof`). The
         * extrinsic will be unsigned and should only be accepted for local
         * authorship (not to be broadcast to the network). This method returns
         * `None` when creation of the extrinsic fails, e.g. if equivocation
         * reporting is disabled for the given runtime (i.e. this method is
         * hardcoded to return `None`). Only useful in an offchain context.
         */
        submit_report_equivocation_unsigned_extrinsic: RuntimeDescriptor<[equivocation_proof: Anonymize<I68ii5ik8avr9o>, key_owner_proof: Uint8Array], boolean>;
    };
    /**
     * The authority discovery api.
     *
     * This api is used by the `client/authority-discovery` module to retrieve identifiers
     * of the current and next authority set.
     */
    AuthorityDiscoveryApi: {
        /**
         * Retrieve authority identifiers of the current and next authority set.
         */
        authorities: RuntimeDescriptor<[], Anonymize<Ic5m5lp1oioo8r>>;
    };
    /**
     * Runtime API for querying oracle data from the blockchain.
     *
     * This trait provides methods to retrieve oracle data without requiring direct
     * storage access. It's designed to be called from external clients, RPC nodes,
     * and other blockchain infrastructure components that need access to oracle
     * information.
     *
     * The API is generic over three type parameters:
     * - `ProviderId`: Identifies the oracle provider or data source
     * - `Key`: The oracle key identifying the specific data feed
     * - `Value`: The oracle data value type
     */
    OracleApi: {
        /**
         * Retrieves a specific oracle value for a given provider and key.
         *
         * Returns the current oracle value if available, or `None` if no data exists
         * for the specified provider and key combination.
         *
         * # Parameters
         *
         * * `provider_id`: The oracle provider identifier
         * * `key`: The oracle key identifying the data feed
         *
         * # Returns
         *
         * Returns `Some(value)` if oracle data exists, `None` otherwise.
         */
        get_value: RuntimeDescriptor<[provider_id: number, key: number], Anonymize<I35p85j063s0il>>;
        /**
         * Retrieves all oracle values for a specific provider.
         *
         * Returns a vector of key-value pairs containing all available oracle data
         * from the specified provider. Each pair contains the oracle key and its
         * corresponding value (if available).
         *
         * # Parameters
         *
         * * `provider_id`: The oracle provider identifier
         *
         * # Returns
         *
         * Returns a vector of `(Key, Option<Value>)` pairs representing all oracle
         * data available from the specified provider.
         */
        get_all_values: RuntimeDescriptor<[provider_id: number], Anonymize<I53vj2e4msforp>>;
    };
    /**
     * The API to query account nonce.
     */
    AccountNonceApi: {
        /**
         * Get current account nonce of given `AccountId`.
         */
        account_nonce: RuntimeDescriptor<[account: SS58String], number>;
    };
    /**
    
     */
    AssetsApi: {
        /**
         * Returns the list of `AssetId`s and corresponding balance that an `AccountId` has.
         */
        account_balances: RuntimeDescriptor<[account: SS58String], Anonymize<If9jidduiuq7vv>>;
    };
    /**
     * The API used to dry-run contract interactions.
     */
    ContractsApi: {
        /**
         * Perform a call from a specified account to a given contract.
         *
         * See [`crate::Pallet::bare_call`].
         */
        call: RuntimeDescriptor<[origin: SS58String, dest: SS58String, value: bigint, gas_limit: Anonymize<Iasb8k6ash5mjn>, storage_deposit_limit: Anonymize<I35p85j063s0il>, input_data: Uint8Array], Anonymize<Ic9sg38spglsac>>;
        /**
         * Instantiate a new contract.
         *
         * See `[crate::Pallet::bare_instantiate]`.
         */
        instantiate: RuntimeDescriptor<[origin: SS58String, value: bigint, gas_limit: Anonymize<Iasb8k6ash5mjn>, storage_deposit_limit: Anonymize<I35p85j063s0il>, code: Anonymize<I9sijb8gfrns29>, data: Uint8Array, salt: Uint8Array], Anonymize<Ifjj5cmoh609on>>;
        /**
         * Upload new code without instantiating a contract from it.
         *
         * See [`crate::Pallet::bare_upload_code`].
         */
        upload_code: RuntimeDescriptor<[origin: SS58String, code: Uint8Array, storage_deposit_limit: Anonymize<I35p85j063s0il>, determinism: Anonymize<I2dfliekq1ed7e>], Anonymize<Idi8peb5lpo0e3>>;
        /**
         * Query a given storage key in a given contract.
         *
         * Returns `Ok(Some(Vec<u8>))` if the storage value exists under the given key in the
         * specified account and `Ok(None)` if it doesn't. If the account specified by the address
         * doesn't exist, or doesn't have a contract then `Err` is returned.
         */
        get_storage: RuntimeDescriptor<[address: SS58String, key: Uint8Array], Anonymize<I9u22scd4ksrjm>>;
    };
    /**
    
     */
    TransactionPaymentApi: {
        /**
        
         */
        query_info: RuntimeDescriptor<[uxt: Uint8Array, len: number], Anonymize<I6spmpef2c7svf>>;
        /**
        
         */
        query_fee_details: RuntimeDescriptor<[uxt: Uint8Array, len: number], Anonymize<Iei2mvq0mjvt81>>;
        /**
        
         */
        query_weight_to_fee: RuntimeDescriptor<[weight: Anonymize<I4q39t5hn830vp>], bigint>;
        /**
        
         */
        query_length_to_fee: RuntimeDescriptor<[length: number], bigint>;
    };
    /**
     * This runtime api allows people to query the size of the liquidity pools
     * and quote prices for swaps.
     */
    AssetConversionApi: {
        /**
         * Provides a quote for [`Pallet::swap_tokens_for_exact_tokens`].
         *
         * Note that the price may have changed by the time the transaction is executed.
         * (Use `amount_in_max` to control slippage.)
         */
        quote_price_tokens_for_exact_tokens: RuntimeDescriptor<[asset1: Anonymize<Ikjpbtmstl9nm>, asset2: Anonymize<Ikjpbtmstl9nm>, amount: bigint, include_fee: boolean], Anonymize<I35p85j063s0il>>;
        /**
         * Provides a quote for [`Pallet::swap_exact_tokens_for_tokens`].
         *
         * Note that the price may have changed by the time the transaction is executed.
         * (Use `amount_out_min` to control slippage.)
         */
        quote_price_exact_tokens_for_tokens: RuntimeDescriptor<[asset1: Anonymize<Ikjpbtmstl9nm>, asset2: Anonymize<Ikjpbtmstl9nm>, amount: bigint, include_fee: boolean], Anonymize<I35p85j063s0il>>;
        /**
         * Returns the size of the liquidity pool for the given asset pair.
         */
        get_reserves: RuntimeDescriptor<[asset1: Anonymize<Ikjpbtmstl9nm>, asset2: Anonymize<Ikjpbtmstl9nm>], Anonymize<I5vv5n03oo8gas>>;
    };
    /**
    
     */
    TransactionPaymentCallApi: {
        /**
         * Query information of a dispatch class, weight, and fee of a given encoded `Call`.
         */
        query_call_info: RuntimeDescriptor<[call: Anonymize<I2t2hv6jbqq8q3>, len: number], Anonymize<I6spmpef2c7svf>>;
        /**
         * Query fee details of a given encoded `Call`.
         */
        query_call_fee_details: RuntimeDescriptor<[call: Anonymize<I2t2hv6jbqq8q3>, len: number], Anonymize<Iei2mvq0mjvt81>>;
        /**
         * Query the output of the current `WeightToFee` given some input.
         */
        query_weight_to_fee: RuntimeDescriptor<[weight: Anonymize<I4q39t5hn830vp>], bigint>;
        /**
         * Query the output of the current `LengthToFee` given some input.
         */
        query_length_to_fee: RuntimeDescriptor<[length: number], bigint>;
    };
    /**
    
     */
    NftsApi: {
        /**
        
         */
        owner: RuntimeDescriptor<[collection: number, item: number], Anonymize<Ihfphjolmsqq1>>;
        /**
        
         */
        collection_owner: RuntimeDescriptor<[collection: number], Anonymize<Ihfphjolmsqq1>>;
        /**
        
         */
        attribute: RuntimeDescriptor<[collection: number, item: number, key: Uint8Array], Anonymize<Iabpgqcjikia83>>;
        /**
        
         */
        custom_attribute: RuntimeDescriptor<[account: SS58String, collection: number, item: number, key: Uint8Array], Anonymize<Iabpgqcjikia83>>;
        /**
        
         */
        system_attribute: RuntimeDescriptor<[collection: number, item: Anonymize<I4arjljr6dpflb>, key: Uint8Array], Anonymize<Iabpgqcjikia83>>;
        /**
        
         */
        collection_attribute: RuntimeDescriptor<[collection: number, key: Uint8Array], Anonymize<Iabpgqcjikia83>>;
    };
    /**
     * API necessary for BEEFY voters.
     */
    BeefyApi: {
        /**
         * Return the block number where BEEFY consensus is enabled/started
         */
        beefy_genesis: RuntimeDescriptor<[], Anonymize<I4arjljr6dpflb>>;
        /**
         * Return the current active BEEFY validator set
         */
        validator_set: RuntimeDescriptor<[], Anonymize<Ifogo2hpqpe6b4>>;
        /**
         * Submits an unsigned extrinsic to report a double voting equivocation. The caller
         * must provide the double voting proof and a key ownership proof
         * (should be obtained using `generate_key_ownership_proof`). The
         * extrinsic will be unsigned and should only be accepted for local
         * authorship (not to be broadcast to the network). This method returns
         * `None` when creation of the extrinsic fails, e.g. if equivocation
         * reporting is disabled for the given runtime (i.e. this method is
         * hardcoded to return `None`). Only useful in an offchain context.
         */
        submit_report_double_voting_unsigned_extrinsic: RuntimeDescriptor<[equivocation_proof: Anonymize<Ifiofttj73fsk1>, key_owner_proof: Uint8Array], boolean>;
        /**
         * Submits an unsigned extrinsic to report a fork voting equivocation. The caller
         * must provide the fork voting proof (the ancestry proof should be obtained using
         * `generate_ancestry_proof`) and a key ownership proof (should be obtained using
         * `generate_key_ownership_proof`). The extrinsic will be unsigned and should only
         * be accepted for local authorship (not to be broadcast to the network). This method
         * returns `None` when creation of the extrinsic fails, e.g. if equivocation
         * reporting is disabled for the given runtime (i.e. this method is
         * hardcoded to return `None`). Only useful in an offchain context.
         */
        submit_report_fork_voting_unsigned_extrinsic: RuntimeDescriptor<[equivocation_proof: Anonymize<I25plekc1moieu>, key_owner_proof: Uint8Array], boolean>;
        /**
         * Submits an unsigned extrinsic to report a future block voting equivocation. The caller
         * must provide the future block voting proof and a key ownership proof
         * (should be obtained using `generate_key_ownership_proof`).
         * The extrinsic will be unsigned and should only be accepted for local
         * authorship (not to be broadcast to the network). This method returns
         * `None` when creation of the extrinsic fails, e.g. if equivocation
         * reporting is disabled for the given runtime (i.e. this method is
         * hardcoded to return `None`). Only useful in an offchain context.
         */
        submit_report_future_block_voting_unsigned_extrinsic: RuntimeDescriptor<[equivocation_proof: Anonymize<I3eao7ea0kppv8>, key_owner_proof: Uint8Array], boolean>;
        /**
         * Generates a proof of key ownership for the given authority in the
         * given set. An example usage of this module is coupled with the
         * session historical module to prove that a given authority key is
         * tied to a given staking identity during a specific session. Proofs
         * of key ownership are necessary for submitting equivocation reports.
         * NOTE: even though the API takes a `set_id` as parameter the current
         * implementations ignores this parameter and instead relies on this
         * method being called at the correct block height, i.e. any point at
         * which the given set id is live on-chain. Future implementations will
         * instead use indexed data through an offchain worker, not requiring
         * older states to be available.
         */
        generate_key_ownership_proof: RuntimeDescriptor<[set_id: bigint, authority_id: SizedHex<33>], Anonymize<Iabpgqcjikia83>>;
    };
    /**
     * API to interact with MMR pallet.
     */
    MmrApi: {
        /**
         * Return the on-chain MMR root hash.
         */
        mmr_root: RuntimeDescriptor<[], Anonymize<I7rj2bnb76oko1>>;
        /**
         * Return the number of MMR blocks in the chain.
         */
        mmr_leaf_count: RuntimeDescriptor<[], Anonymize<I4o356o7eq06ms>>;
        /**
         * Generate MMR proof for a series of block numbers. If `best_known_block_number = Some(n)`,
         * use historical MMR state at given block height `n`. Else, use current MMR state.
         */
        generate_proof: RuntimeDescriptor<[block_numbers: Anonymize<Icgljjb6j82uhn>, best_known_block_number: Anonymize<I4arjljr6dpflb>], Anonymize<I46e127tr8ma2h>>;
        /**
         * Generates a proof that the `prev_block_number` is part of the canonical chain at
         * `best_known_block_number`.
         */
        generate_ancestry_proof: RuntimeDescriptor<[prev_block_number: number, best_known_block_number: Anonymize<I4arjljr6dpflb>], Anonymize<Irtu011t0fjnh>>;
        /**
         * Verify MMR proof against on-chain MMR for a batch of leaves.
         *
         * Note this function will use on-chain MMR root hash and check if the proof matches the hash.
         * Note, the leaves should be sorted such that corresponding leaves and leaf indices have the
         * same position in both the `leaves` vector and the `leaf_indices` vector contained in the [LeafProof]
         */
        verify_proof: RuntimeDescriptor<[leaves: Anonymize<Itom7fk49o0c9>, proof: Anonymize<I38ee9is0n4jn9>], Anonymize<Ie88mmnuvmuvp5>>;
        /**
         * Verify MMR proof against given root hash for a batch of leaves.
         *
         * Note this function does not require any on-chain storage - the
         * proof is verified against given MMR root hash.
         *
         * Note, the leaves should be sorted such that corresponding leaves and leaf indices have the
         * same position in both the `leaves` vector and the `leaf_indices` vector contained in the [LeafProof]
         */
        verify_proof_stateless: RuntimeDescriptor<[root: SizedHex<32>, leaves: Anonymize<Itom7fk49o0c9>, proof: Anonymize<I38ee9is0n4jn9>], Anonymize<Ie88mmnuvmuvp5>>;
    };
    /**
     * API to query the mixnet session status and mixnode sets, and to register mixnodes.
     */
    MixnetApi: {
        /**
         * Get the index and phase of the current session.
         */
        session_status: RuntimeDescriptor<[], Anonymize<Idp7c8fe2gno1b>>;
        /**
         * Get the mixnode set for the previous session.
         */
        prev_mixnodes: RuntimeDescriptor<[], Anonymize<I2q4hkchnhgjdq>>;
        /**
         * Get the mixnode set for the current session.
         */
        current_mixnodes: RuntimeDescriptor<[], Anonymize<I2q4hkchnhgjdq>>;
        /**
         * Try to register a mixnode for the next session.
         *
         * If a registration extrinsic is submitted, `true` is returned. The caller should avoid
         * calling `maybe_register` again for a few blocks, to give the submitted extrinsic a
         * chance to get included.
         *
         * With the above exception, `maybe_register` is designed to be called every block. Most
         * of the time it will not do anything, for example:
         *
         * - If it is not an appropriate time to submit a registration extrinsic.
         * - If the local node has already registered a mixnode for the next session.
         * - If the local node is not permitted to register a mixnode for the next session.
         *
         * `session_index` should match `session_status().current_index`; if it does not, `false`
         * is returned immediately.
         */
        maybe_register: RuntimeDescriptor<[session_index: number, mixnode: Anonymize<I8t75ej2kqe171>], boolean>;
    };
    /**
     * Session keys runtime api.
     */
    SessionKeys: {
        /**
         * Generate a set of session keys with optionally using the given seed.
         * The keys should be stored within the keystore exposed via runtime
         * externalities.
         *
         * The seed needs to be a valid `utf8` string.
         *
         * Returns the concatenated SCALE encoded public keys.
         */
        generate_session_keys: RuntimeDescriptor<[owner: Uint8Array, seed: Anonymize<Iabpgqcjikia83>], Anonymize<I4ph3d1eepnmr1>>;
        /**
         * Decode the given public session keys.
         *
         * Returns the list of public raw public keys + key type.
         */
        decode_session_keys: RuntimeDescriptor<[encoded: Uint8Array], Anonymize<Icerf8h8pdu8ss>>;
    };
    /**
     * Runtime API trait for transaction storage support.
     */
    TransactionStorageApi: {
        /**
         * Retention period for indexed data, in blocks.
         */
        retention_period: RuntimeDescriptor<[], number>;
        /**
         * Indexed-transaction metadata for `block`.
         *
         * Returns an empty vector if the block has no indexed transactions or
         * is outside the retention window.
         */
        indexed_transactions: RuntimeDescriptor<[block: number], Anonymize<If4oj302humfb5>>;
    };
    /**
     * API to interact with `RuntimeGenesisConfig` for the runtime
     */
    GenesisBuilder: {
        /**
         * Build `RuntimeGenesisConfig` from a JSON blob not using any defaults and store it in the
         * storage.
         *
         * In the case of a FRAME-based runtime, this function deserializes the full
         * `RuntimeGenesisConfig` from the given JSON blob and puts it into the storage. If the
         * provided JSON blob is incorrect or incomplete or the deserialization fails, an error
         * is returned.
         *
         * Please note that provided JSON blob must contain all `RuntimeGenesisConfig` fields, no
         * defaults will be used.
         */
        build_state: RuntimeDescriptor<[json: Uint8Array], Anonymize<Ie9sr1iqcg3cgm>>;
        /**
         * Returns a JSON blob representation of the built-in `RuntimeGenesisConfig` identified by
         * `id`.
         *
         * If `id` is `None` the function should return JSON blob representation of the default
         * `RuntimeGenesisConfig` struct of the runtime. Implementation must provide default
         * `RuntimeGenesisConfig`.
         *
         * Otherwise function returns a JSON representation of the built-in, named
         * `RuntimeGenesisConfig` preset identified by `id`, or `None` if such preset does not
         * exist. Returned `Vec<u8>` contains bytes of JSON blob (patch) which comprises a list of
         * (potentially nested) key-value pairs that are intended for customizing the default
         * runtime genesis config. The patch shall be merged (rfc7386) with the JSON representation
         * of the default `RuntimeGenesisConfig` to create a comprehensive genesis config that can
         * be used in `build_state` method.
         */
        get_preset: RuntimeDescriptor<[id: Anonymize<I1mqgk2tmnn9i2>], Anonymize<Iabpgqcjikia83>>;
        /**
         * Returns a list of identifiers for available builtin `RuntimeGenesisConfig` presets.
         *
         * The presets from the list can be queried with [`GenesisBuilder::get_preset`] method. If
         * no named presets are provided by the runtime the list is empty.
         */
        preset_names: RuntimeDescriptor<[], Anonymize<I6lr8sctk0bi4e>>;
    };
    /**
     * The API used to dry-run contract interactions.
     */
    ReviveApi: {
        /**
         * Returns the current ETH block.
         *
         * This is one block behind the substrate block.
         */
        eth_block: RuntimeDescriptor<[], Anonymize<Idq3n4esn5nvc5>>;
        /**
         * Returns the ETH block hash for the given block number.
         */
        eth_block_hash: RuntimeDescriptor<[number: Anonymize<I4totqt881mlti>], Anonymize<I4s6vifaf8k998>>;
        /**
         * The details needed to reconstruct the receipt information offchain.
         *
         * # Note
         *
         * Each entry corresponds to the appropriate Ethereum transaction in the current block.
         */
        eth_receipt_data: RuntimeDescriptor<[], Anonymize<I3oiqcurom3m43>>;
        /**
         * Returns the block gas limit.
         */
        block_gas_limit: RuntimeDescriptor<[], Anonymize<I4totqt881mlti>>;
        /**
         * Returns the block gas limit as calculated from the weights.
         */
        max_extrinsic_weight_in_gas: RuntimeDescriptor<[], Anonymize<I4totqt881mlti>>;
        /**
         * Returns the free balance of the given `[H160]` address, using EVM decimals.
         */
        balance: RuntimeDescriptor<[address: SizedHex<20>], Anonymize<I4totqt881mlti>>;
        /**
         * Returns the gas price.
         */
        gas_price: RuntimeDescriptor<[], Anonymize<I4totqt881mlti>>;
        /**
         * Returns the nonce of the given `[H160]` address.
         */
        nonce: RuntimeDescriptor<[address: SizedHex<20>], number>;
        /**
         * Perform a call from a specified account to a given contract.
         *
         * See [`crate::Pallet::bare_call`].
         */
        call: RuntimeDescriptor<[origin: SS58String, dest: SizedHex<20>, value: bigint, gas_limit: Anonymize<Iasb8k6ash5mjn>, storage_deposit_limit: Anonymize<I35p85j063s0il>, input_data: Uint8Array], Anonymize<Ibt0lihobh9n50>>;
        /**
         * Instantiate a new contract.
         *
         * See `[crate::Pallet::bare_instantiate]`.
         */
        instantiate: RuntimeDescriptor<[origin: SS58String, value: bigint, gas_limit: Anonymize<Iasb8k6ash5mjn>, storage_deposit_limit: Anonymize<I35p85j063s0il>, code: Anonymize<I9sijb8gfrns29>, data: Uint8Array, salt: Anonymize<I4s6vifaf8k998>], Anonymize<I9ignf80plhtp3>>;
        /**
         * Perform an Ethereum call.
         *
         * See [`crate::Pallet::dry_run_eth_transact`]
         */
        eth_transact: RuntimeDescriptor<[tx: Anonymize<I6f9v7emp7t5ba>], Anonymize<Ida7d8eqrkav55>>;
        /**
         * Perform an Ethereum call.
         *
         * See [`crate::Pallet::dry_run_eth_transact`]
         */
        eth_transact_with_config: RuntimeDescriptor<[tx: Anonymize<I6f9v7emp7t5ba>, config: Anonymize<I9mq0s1ommikm5>], Anonymize<Ida7d8eqrkav55>>;
        /**
         * Estimates the amount of gas that a transactions requires.
         *
         * This function estimates the gas of the transaction according to the same binary search
         * algorithm that's implemented in Geth. It stops when with an acceptable error ratio of
         * 1.5% so that the algorithm terminates early.
         */
        eth_estimate_gas: RuntimeDescriptor<[tx: Anonymize<I6f9v7emp7t5ba>, config: Anonymize<I9mq0s1ommikm5>], Anonymize<I2806mq9p1klk7>>;
        /**
         * Return the pre-dispatch weight booked for the signed Ethereum transaction payload.
         */
        eth_pre_dispatch_weight: RuntimeDescriptor<[tx: Uint8Array], Anonymize<Iau1ib3fio8i01>>;
        /**
         * Upload new code without instantiating a contract from it.
         *
         * See [`crate::Pallet::bare_upload_code`].
         */
        upload_code: RuntimeDescriptor<[origin: SS58String, code: Uint8Array, storage_deposit_limit: Anonymize<I35p85j063s0il>], Anonymize<Idi8peb5lpo0e3>>;
        /**
         * Query a given storage key in a given contract.
         *
         * Returns `Ok(Some(Vec<u8>))` if the storage value exists under the given key in the
         * specified account and `Ok(None)` if it doesn't. If the account specified by the address
         * doesn't exist, or doesn't have a contract then `Err` is returned.
         */
        get_storage: RuntimeDescriptor<[address: SizedHex<20>, key: SizedHex<32>], Anonymize<I5pr7ru7k4ujjt>>;
        /**
         * Query a given variable-sized storage key in a given contract.
         *
         * Returns `Ok(Some(Vec<u8>))` if the storage value exists under the given key in the
         * specified account and `Ok(None)` if it doesn't. If the account specified by the address
         * doesn't exist, or doesn't have a contract then `Err` is returned.
         */
        get_storage_var_key: RuntimeDescriptor<[address: SizedHex<20>, key: Uint8Array], Anonymize<I5pr7ru7k4ujjt>>;
        /**
         * Traces the execution of an entire block and returns call traces.
         *
         * This is intended to be called through `state_call` to replay the block from the
         * parent block.
         *
         * See eth-rpc `debug_traceBlockByNumber` for usage.
         */
        trace_block: RuntimeDescriptor<[block: Anonymize<Iaqet9jc3ihboe>, config: Anonymize<Ift65j5o2ie116>], Anonymize<I5r43bh3m67flj>>;
        /**
         * Traces the execution of a specific transaction within a block.
         *
         * This is intended to be called through `state_call` to replay the block from the
         * parent hash up to the transaction.
         *
         * See eth-rpc `debug_traceTransaction` for usage.
         */
        trace_tx: RuntimeDescriptor<[block: Anonymize<Iaqet9jc3ihboe>, tx_index: number, config: Anonymize<Ift65j5o2ie116>], Anonymize<Idkcb4p19k6ugl>>;
        /**
         * Dry run and return the trace of the given call.
         *
         * See eth-rpc `debug_traceCall` for usage.
         */
        trace_call: RuntimeDescriptor<[tx: Anonymize<I6f9v7emp7t5ba>, config: Anonymize<Ift65j5o2ie116>], Anonymize<I182b5tlke1q67>>;
        /**
         * Dry run and return the trace of the given call with additional configuration.
         *
         * Like [`Self::trace_call`], but accepts a [`TracingConfigV1`] that can carry state
         * overrides. The config must be the **last argument** for backwards compatibility.
         */
        trace_call_with_config: RuntimeDescriptor<[tx: Anonymize<I6f9v7emp7t5ba>, tracer_type: Anonymize<Ift65j5o2ie116>, config: Anonymize<Id22r0gklsr0ok>], Anonymize<I182b5tlke1q67>>;
        /**
         * The address of the validator that produced the current block.
         */
        block_author: RuntimeDescriptor<[], SizedHex<20>>;
        /**
         * Get the H160 address associated to this account id
         */
        address: RuntimeDescriptor<[account_id: SS58String], SizedHex<20>>;
        /**
         * Get the account id associated to this H160 address.
         */
        account_id: RuntimeDescriptor<[address: SizedHex<20>], SS58String>;
        /**
         * The address used to call the runtime's pallets dispatchables
         */
        runtime_pallets_address: RuntimeDescriptor<[], SizedHex<20>>;
        /**
         * The code at the specified address taking pre-compiles into account.
         */
        code: RuntimeDescriptor<[address: SizedHex<20>], Uint8Array>;
        /**
         * Construct the new balance and dust components of this EVM balance.
         */
        new_balance_with_dust: RuntimeDescriptor<[balance: Anonymize<I4totqt881mlti>], Anonymize<I512dtcl0pn07c>>;
        /**
        
         */
        version_declarations: RuntimeDescriptor<[], Anonymize<I2ec37pbcqq1ro>>;
        /**
        
         */
        eth_block_versioned: RuntimeDescriptor<[input: Anonymize<I4dgtkhmhiffkf>], Anonymize<Ibgnf8no4mn5ud>>;
        /**
        
         */
        eth_block_hash_versioned: RuntimeDescriptor<[input: Anonymize<Ibf1s6i393v4p3>], Anonymize<I6ndsf1m9crheh>>;
        /**
        
         */
        eth_receipt_data_versioned: RuntimeDescriptor<[input: Anonymize<I4dgtkhmhiffkf>], Anonymize<I4hnd166aeftfc>>;
        /**
        
         */
        block_gas_limit_versioned: RuntimeDescriptor<[input: Anonymize<I4dgtkhmhiffkf>], Anonymize<Ibf1s6i393v4p3>>;
        /**
        
         */
        max_extrinsic_weight_in_gas_versioned: RuntimeDescriptor<[input: Anonymize<I4dgtkhmhiffkf>], Anonymize<Ibf1s6i393v4p3>>;
        /**
        
         */
        balance_versioned: RuntimeDescriptor<[input: Anonymize<Ie7st2ejf0s7p7>], Anonymize<Ibf1s6i393v4p3>>;
        /**
        
         */
        gas_price_versioned: RuntimeDescriptor<[input: Anonymize<I4dgtkhmhiffkf>], Anonymize<Ibf1s6i393v4p3>>;
        /**
        
         */
        nonce_versioned: RuntimeDescriptor<[input: Anonymize<Ie7st2ejf0s7p7>], Anonymize<I443q2eobpl1oo>>;
        /**
        
         */
        call_versioned: RuntimeDescriptor<[input: Anonymize<Iemjikdfnke6fr>], Anonymize<I37m8k9k51pj9s>>;
        /**
        
         */
        instantiate_versioned: RuntimeDescriptor<[input: Anonymize<Ia685ab8s4usht>], Anonymize<I22ecnhcr9cmso>>;
        /**
        
         */
        eth_transact_versioned: RuntimeDescriptor<[input: Anonymize<I5bdp74m07b0eb>], Anonymize<I1qo9nd5q94bfi>>;
        /**
        
         */
        eth_estimate_gas_versioned: RuntimeDescriptor<[input: Anonymize<Ic0l56ij40lma0>], Anonymize<Iful5cbgvctt9u>>;
        /**
        
         */
        eth_pre_dispatch_weight_versioned: RuntimeDescriptor<[input: Anonymize<Iavvurav4044cq>], Anonymize<Ib49a5bg3lsb8k>>;
        /**
        
         */
        upload_code_versioned: RuntimeDescriptor<[input: Anonymize<Iadsikp5ionsgv>], Anonymize<Icgjgvpjeeblbi>>;
        /**
        
         */
        get_storage_versioned: RuntimeDescriptor<[input: Anonymize<Idgc44jj42ek3d>], Anonymize<Iru6diprdsqp8>>;
        /**
        
         */
        runtime_pallets_address_versioned: RuntimeDescriptor<[input: Anonymize<I4dgtkhmhiffkf>], Anonymize<Ie7st2ejf0s7p7>>;
        /**
        
         */
        code_versioned: RuntimeDescriptor<[input: Anonymize<Ie7st2ejf0s7p7>], Anonymize<Iavvurav4044cq>>;
        /**
        
         */
        account_id_versioned: RuntimeDescriptor<[input: Anonymize<Ie7st2ejf0s7p7>], Anonymize<I7ddmu7ej0lg1q>>;
        /**
        
         */
        new_balance_with_dust_versioned: RuntimeDescriptor<[input: Anonymize<Ibf1s6i393v4p3>], Anonymize<Ifipqnuto78ql4>>;
        /**
        
         */
        block_author_versioned: RuntimeDescriptor<[input: Anonymize<I4dgtkhmhiffkf>], Anonymize<Ie7st2ejf0s7p7>>;
        /**
        
         */
        address_versioned: RuntimeDescriptor<[input: Anonymize<I7ddmu7ej0lg1q>], Anonymize<Ie7st2ejf0s7p7>>;
        /**
        
         */
        trace_block_versioned: RuntimeDescriptor<[input: Anonymize<If3pcbgmbe0gqe>], Anonymize<I933ji9qe9nc1k>>;
        /**
        
         */
        trace_tx_versioned: RuntimeDescriptor<[input: Anonymize<I7h0upq0njhdnu>], Anonymize<Iabdqtqo5t5boh>>;
        /**
        
         */
        trace_call_versioned: RuntimeDescriptor<[input: Anonymize<Icpmie0rdcstlj>], Anonymize<I1au3n925eptkb>>;
    };
};
export type PortaldotDispatchError = Anonymize<I4joek0d1bbeb>;
export type PortaldotExtensions = {
    "CheckSpecVersion": {
        additionalSigned: number;
    };
    "CheckTxVersion": {
        additionalSigned: number;
    };
    "CheckGenesis": {
        additionalSigned: SizedHex<32>;
    };
    "CheckMortality": {
        value: ExtensionsCheckMortality;
        additionalSigned: SizedHex<32>;
    };
    "CheckNonce": {
        value: number;
    };
    "ChargeAssetTxPayment": {
        value: Anonymize<I4oqfks1952m1e>;
    };
    "CheckMetadataHash": {
        value: Anonymize<I87rnrnks7g0hm>;
        additionalSigned: Anonymize<I4s6vifaf8k998>;
    };
};
type IRequiredExtensions = PlainDescriptor<"CheckSpecVersion" | "CheckTxVersion" | "CheckGenesis" | "CheckMortality" | "CheckNonce" | "ChargeAssetTxPayment" | "CheckMetadataHash">;
type PalletsTypedef = {
    __storage: IStorage;
    __tx: ICalls;
    __event: IEvent;
    __error: IError;
    __const: IConstants;
    __view: IViewFns;
};
export type Portaldot = {
    descriptors: {
        pallets: PalletsTypedef;
        apis: IRuntimeCalls;
    } & Promise<any>;
    metadataTypes: Promise<Uint8Array>;
    extensions: PortaldotExtensions;
    requiredExtensions: IRequiredExtensions;
    getMetadata: () => Promise<Uint8Array>;
    genesis: string | undefined;
};
declare const _allDescriptors: Portaldot;
export default _allDescriptors;
export type PortaldotApis = ApisFromDef<IRuntimeCalls>;
export type PortaldotQueries = QueryFromPalletsDef<PalletsTypedef>;
export type PortaldotCalls = TxFromPalletsDef<PalletsTypedef>;
export type PortaldotEvents = EventsFromPalletsDef<PalletsTypedef>;
export type PortaldotErrors = ErrorsFromPalletsDef<PalletsTypedef>;
export type PortaldotConstants = ConstFromPalletsDef<PalletsTypedef>;
export type PortaldotViewFns = ViewFnsFromPalletsDef<PalletsTypedef>;
export type PortaldotCallData = Anonymize<I2t2hv6jbqq8q3> & {
    value: {
        type: string;
    };
};
type AllInteractions = {
    storage: {
        System: ['Account', 'ExtrinsicCount', 'InherentsApplied', 'BlockWeight', 'BlockSize', 'BlockHash', 'ExtrinsicData', 'Number', 'ParentHash', 'Digest', 'Events', 'EventCount', 'EventTopics', 'LastRuntimeUpgrade', 'BlocksTillUpgrade', 'UpgradedToU32RefCount', 'UpgradedToTripleRefCount', 'ExecutionPhase', 'AuthorizedUpgrade', 'ExtrinsicWeightReclaimed'];
        Babe: ['EpochIndex', 'Authorities', 'GenesisSlot', 'CurrentSlot', 'Randomness', 'PendingEpochConfigChange', 'NextRandomness', 'NextAuthorities', 'SegmentIndex', 'UnderConstruction', 'Initialized', 'AuthorVrfRandomness', 'EpochStart', 'Lateness', 'EpochConfig', 'NextEpochConfig', 'SkippedEpochs'];
        Timestamp: ['Now', 'DidUpdate'];
        Authorship: ['Author'];
        Indices: ['Accounts'];
        Balances: ['TotalIssuance', 'InactiveIssuance', 'Account', 'Locks', 'Reserves', 'Holds', 'Freezes'];
        TransactionPayment: ['NextFeeMultiplier', 'StorageVersion', 'TxPaymentCredit'];
        ElectionProviderMultiPhase: ['Round', 'CurrentPhase', 'QueuedSolution', 'Snapshot', 'DesiredTargets', 'SnapshotMetadata', 'SignedSubmissionNextIndex', 'SignedSubmissionIndices', 'SignedSubmissionsMap', 'MinimumUntrustedScore'];
        Staking: ['ValidatorCount', 'MinimumValidatorCount', 'Invulnerables', 'Bonded', 'MinNominatorBond', 'MinValidatorBond', 'MinimumActiveStake', 'MinCommission', 'Ledger', 'Payee', 'Validators', 'CounterForValidators', 'MaxValidatorsCount', 'Nominators', 'CounterForNominators', 'VirtualStakers', 'CounterForVirtualStakers', 'MaxNominatorsCount', 'CurrentEra', 'ActiveEra', 'ErasStartSessionIndex', 'ErasStakers', 'ErasStakersOverview', 'ErasStakersClipped', 'ErasStakersPaged', 'ClaimedRewards', 'ErasValidatorPrefs', 'ErasValidatorReward', 'ErasRewardPoints', 'ErasTotalStake', 'ForceEra', 'MaxStakedRewards', 'SlashRewardFraction', 'CanceledSlashPayout', 'UnappliedSlashes', 'BondedEras', 'ValidatorSlashInEra', 'NominatorSlashInEra', 'SlashingSpans', 'SpanSlash', 'CurrentPlannedSession', 'ChillThreshold'];
        Session: ['Validators', 'CurrentIndex', 'QueuedChanged', 'QueuedKeys', 'DisabledValidators', 'NextKeys', 'KeyOwner', 'ExternallySetKeys'];
        TechnicalCommittee: ['Proposals', 'ProposalOf', 'CostOf', 'Voting', 'ProposalCount', 'Members', 'Prime'];
        TechnicalMembership: ['Members', 'Prime'];
        Grandpa: ['State', 'PendingChange', 'NextForced', 'Stalled', 'CurrentSetId', 'SetIdSession', 'Authorities'];
        Treasury: ['ProposalCount', 'Proposals', 'Deactivated', 'Approvals', 'SpendCount', 'Spends', 'LastSpendPeriod'];
        AssetRate: ['ConversionRateToNative'];
        Contracts: ['PristineCode', 'CodeInfoOf', 'Nonce', 'ContractInfoOf', 'DeletionQueue', 'DeletionQueueCounter', 'MigrationInProgress'];
        Sudo: ['Key'];
        ImOnline: ['HeartbeatAfter', 'Keys', 'ReceivedHeartbeats', 'AuthoredBlocks'];
        AuthorityDiscovery: ['Keys', 'NextKeys'];
        Offences: ['Reports', 'ConcurrentReportsIndex'];
        Historical: ['HistoricalSessions', 'StoredRange'];
        Identity: ['IdentityOf', 'UsernameOf', 'SuperOf', 'SubsOf', 'Registrars', 'AuthorityOf', 'UsernameInfoOf', 'PendingUsernames', 'UnbindingUsernames'];
        Recovery: ['FriendGroups', 'Attempt', 'Inheritor'];
        Vesting: ['Vesting', 'StorageVersion'];
        Scheduler: ['IncompleteSince', 'Agenda', 'Retries', 'Lookup'];
        Preimage: ['StatusFor', 'RequestStatusFor', 'PreimageFor'];
        Proxy: ['Proxies', 'Announcements'];
        Multisig: ['Multisigs'];
        Bounties: ['BountyCount', 'Bounties', 'BountyDescriptions', 'BountyApprovals'];
        Assets: ['Asset', 'Account', 'Approvals', 'Metadata', 'Reserves', 'NextAssetId'];
        PoolAssets: ['Asset', 'Account', 'Approvals', 'Metadata', 'Reserves', 'NextAssetId'];
        Beefy: ['Authorities', 'ValidatorSetId', 'NextAuthorities', 'SetIdSession', 'GenesisBlock'];
        Mmr: ['RootHash', 'NumberOfLeaves', 'Nodes'];
        MmrLeaf: ['BeefyAuthorities', 'BeefyNextAuthorities'];
        Lottery: ['LotteryIndex', 'Lottery', 'Participants', 'TicketsCount', 'Tickets', 'CallIndices'];
        Uniques: ['Class', 'OwnershipAcceptance', 'Account', 'ClassAccount', 'Asset', 'ClassMetadataOf', 'InstanceMetadataOf', 'Attribute', 'ItemPriceOf', 'CollectionMaxSupply'];
        Nfts: ['Collection', 'OwnershipAcceptance', 'Account', 'CollectionAccount', 'CollectionRoleOf', 'Item', 'CollectionMetadataOf', 'ItemMetadataOf', 'Attribute', 'ItemPriceOf', 'ItemAttributesApprovalsOf', 'NextCollectionId', 'PendingSwapOf', 'CollectionConfigOf', 'ItemConfigOf'];
        NftFractionalization: ['NftToAsset'];
        TransactionStorage: ['Authorizations', 'Transactions', 'ByteFee', 'EntryFee', 'RetentionPeriod', 'BlockTransactions', 'ProofChecked'];
        VoterList: ['ListNodes', 'CounterForListNodes', 'ListBags', 'NextNodeAutoRebagged', 'Lock', 'PendingRebag', 'CounterForPendingRebag'];
        ChildBounties: ['ChildBountyCount', 'ParentChildBounties', 'ParentTotalChildBounties', 'ChildBounties', 'ChildBountyDescriptionsV1', 'V0ToV1ChildBountyIds', 'ChildrenCuratorFees'];
        NominationPools: ['TotalValueLocked', 'MinJoinBond', 'MinCreateBond', 'MaxPools', 'MaxPoolMembers', 'MaxPoolMembersPerPool', 'GlobalMaxCommission', 'PoolMembers', 'CounterForPoolMembers', 'BondedPools', 'CounterForBondedPools', 'RewardPools', 'CounterForRewardPools', 'SubPoolsStorage', 'CounterForSubPoolsStorage', 'Metadata', 'CounterForMetadata', 'LastPoolId', 'ReversePoolIdLookup', 'CounterForReversePoolIdLookup', 'ClaimPermissions'];
        AssetConversion: ['Pools', 'NextPoolAssetId', 'PoolFees'];
        FastUnstake: ['Head', 'Queue', 'CounterForQueue', 'ErasToCheckPerBlock'];
        MessageQueue: ['BookStateFor', 'ServiceHead', 'Pages'];
        TxPause: ['PausedCalls'];
        SafeMode: ['EnteredUntil', 'Deposits'];
        MultiBlockMigrations: ['Cursor', 'Historic'];
        Broker: ['Configuration', 'Reservations', 'ForceReservations', 'Leases', 'Status', 'SaleInfo', 'PotentialRenewals', 'Regions', 'Workplan', 'Workload', 'InstaPoolContribution', 'InstaPoolIo', 'InstaPoolHistory', 'CoreCountInbox', 'AutoRenewals', 'RevenueInbox'];
        Mixnet: ['CurrentSessionIndex', 'CurrentSessionStartBlock', 'NextAuthorityIds', 'Mixnodes'];
        Parameters: ['Parameters'];
        Revive: ['PristineCode', 'CodeInfoOf', 'AccountInfoOf', 'NativeDepositOf', 'ImmutableDataOf', 'DeletionQueue', 'DeletionQueueCounter', 'OriginalAccount', 'EthereumBlock', 'BlockHash', 'ReceiptInfoData', 'EthBlockBuilderIR', 'EthBlockBuilderFirstValues', 'DebugSettingsOf'];
        DelegatedStaking: ['Delegators', 'CounterForDelegators', 'Agents', 'CounterForAgents'];
        AssetsFreezer: ['Freezes', 'FrozenBalances'];
        Oracle: ['RawValues', 'Values', 'HasDispatched'];
        MultiAssetBounties: ['BountyCount', 'Bounties', 'ChildBounties', 'ChildBountiesPerParent', 'TotalChildBountiesPerParent', 'ChildBountiesValuePerParent', 'CuratorDeposit'];
        AssetsPrecompiles: ['NextAssetIndex', 'AssetIndexToForeignAssetId', 'ForeignAssetIdToAssetIndex'];
        AssetsPrecompilesPermit: ['Nonces'];
        RegistrarPara: ['NextFreeParaId', 'NextMessageId', 'Paras'];
        RegistrarRelay: ['PendingRegistrations', 'CounterForPendingRegistrations'];
    };
    tx: {
        System: ['remark', 'set_heap_pages', 'set_code', 'set_code_without_checks', 'set_storage', 'kill_storage', 'kill_prefix', 'remark_with_event', 'authorize_upgrade', 'authorize_upgrade_without_checks', 'apply_authorized_upgrade'];
        Utility: ['batch', 'as_derivative', 'batch_all', 'dispatch_as', 'force_batch', 'with_weight', 'if_else', 'dispatch_as_fallible'];
        Babe: ['report_equivocation', 'report_equivocation_unsigned', 'plan_config_change'];
        Timestamp: ['set'];
        Indices: ['claim', 'transfer', 'free', 'force_transfer', 'freeze', 'poke_deposit'];
        Balances: ['transfer_allow_death', 'force_transfer', 'transfer_keep_alive', 'transfer_all', 'force_unreserve', 'upgrade_accounts', 'force_set_balance', 'force_adjust_total_issuance', 'burn'];
        ElectionProviderMultiPhase: ['submit_unsigned', 'set_minimum_untrusted_score', 'set_emergency_election_result', 'submit', 'governance_fallback'];
        Staking: ['bond', 'bond_extra', 'unbond', 'withdraw_unbonded', 'validate', 'nominate', 'chill', 'set_payee', 'set_controller', 'set_validator_count', 'increase_validator_count', 'scale_validator_count', 'force_no_eras', 'force_new_era', 'set_invulnerables', 'force_unstake', 'force_new_era_always', 'cancel_deferred_slash', 'payout_stakers', 'rebond', 'reap_stash', 'kick', 'set_staking_configs', 'chill_other', 'force_apply_min_commission', 'set_min_commission', 'payout_stakers_by_page', 'update_payee', 'deprecate_controller_batch', 'restore_ledger', 'migrate_currency', 'manual_slash'];
        Session: ['set_keys', 'purge_keys'];
        TechnicalCommittee: ['set_members', 'execute', 'propose', 'vote', 'disapprove_proposal', 'close', 'kill', 'release_proposal_cost'];
        TechnicalMembership: ['add_member', 'remove_member', 'swap_member', 'reset_members', 'change_key', 'set_prime', 'clear_prime'];
        Grandpa: ['report_equivocation', 'report_equivocation_unsigned', 'note_stalled'];
        Treasury: ['spend_local', 'remove_approval', 'spend', 'payout', 'check_status', 'void_spend'];
        AssetRate: ['create', 'update', 'remove'];
        Contracts: ['call_old_weight', 'instantiate_with_code_old_weight', 'instantiate_old_weight', 'upload_code', 'remove_code', 'set_code', 'call', 'instantiate_with_code', 'instantiate', 'migrate'];
        Sudo: ['sudo', 'sudo_unchecked_weight', 'set_key', 'sudo_as', 'remove_key'];
        ImOnline: ['heartbeat'];
        Identity: ['add_registrar', 'remove_registrar', 'set_identity', 'set_subs', 'clear_identity', 'request_judgement', 'cancel_request', 'set_fee', 'set_account_id', 'set_fields', 'provide_judgement', 'kill_identity', 'add_sub', 'rename_sub', 'remove_sub', 'quit_sub', 'add_username_authority', 'remove_username_authority', 'set_username_for', 'accept_username', 'remove_expired_approval', 'set_primary_username', 'unbind_username', 'remove_username', 'kill_username'];
        Recovery: ['control_inherited_account', 'revoke_inheritor', 'set_friend_groups', 'initiate_attempt', 'approve_attempt', 'finish_attempt', 'cancel_attempt', 'slash_attempt'];
        Vesting: ['vest', 'vest_other', 'vested_transfer', 'force_vested_transfer', 'merge_schedules', 'force_remove_vesting_schedule'];
        Scheduler: ['schedule', 'cancel', 'schedule_named', 'cancel_named', 'schedule_after', 'schedule_named_after', 'set_retry', 'set_retry_named', 'cancel_retry', 'cancel_retry_named'];
        Preimage: ['note_preimage', 'unnote_preimage', 'request_preimage', 'unrequest_preimage', 'ensure_updated'];
        Proxy: ['proxy', 'add_proxy', 'remove_proxy', 'remove_proxies', 'create_pure', 'kill_pure', 'announce', 'remove_announcement', 'reject_announcement', 'proxy_announced', 'poke_deposit'];
        Multisig: ['as_multi_threshold_1', 'as_multi', 'approve_as_multi', 'cancel_as_multi', 'poke_deposit'];
        Bounties: ['propose_bounty', 'approve_bounty', 'propose_curator', 'unassign_curator', 'accept_curator', 'award_bounty', 'claim_bounty', 'close_bounty', 'extend_bounty_expiry', 'approve_bounty_with_curator', 'poke_deposit', 'reclaim_bounty_funds'];
        Assets: ['create', 'force_create', 'start_destroy', 'destroy_accounts', 'destroy_approvals', 'finish_destroy', 'mint', 'burn', 'transfer', 'transfer_keep_alive', 'force_transfer', 'freeze', 'thaw', 'freeze_asset', 'thaw_asset', 'transfer_ownership', 'set_team', 'set_metadata', 'clear_metadata', 'force_set_metadata', 'force_clear_metadata', 'force_asset_status', 'approve_transfer', 'cancel_approval', 'force_cancel_approval', 'transfer_approved', 'touch', 'refund', 'set_min_balance', 'touch_other', 'refund_other', 'block', 'transfer_all', 'set_reserves'];
        PoolAssets: ['create', 'force_create', 'start_destroy', 'destroy_accounts', 'destroy_approvals', 'finish_destroy', 'mint', 'burn', 'transfer', 'transfer_keep_alive', 'force_transfer', 'freeze', 'thaw', 'freeze_asset', 'thaw_asset', 'transfer_ownership', 'set_team', 'set_metadata', 'clear_metadata', 'force_set_metadata', 'force_clear_metadata', 'force_asset_status', 'approve_transfer', 'cancel_approval', 'force_cancel_approval', 'transfer_approved', 'touch', 'refund', 'set_min_balance', 'touch_other', 'refund_other', 'block', 'transfer_all', 'set_reserves'];
        Beefy: ['report_double_voting', 'report_double_voting_unsigned', 'set_new_genesis', 'report_fork_voting', 'report_fork_voting_unsigned', 'report_future_block_voting', 'report_future_block_voting_unsigned'];
        Lottery: ['buy_ticket', 'set_calls', 'start_lottery', 'stop_repeat'];
        Uniques: ['create', 'force_create', 'destroy', 'mint', 'burn', 'transfer', 'redeposit', 'freeze', 'thaw', 'freeze_collection', 'thaw_collection', 'transfer_ownership', 'set_team', 'approve_transfer', 'cancel_approval', 'force_item_status', 'set_attribute', 'clear_attribute', 'set_metadata', 'clear_metadata', 'set_collection_metadata', 'clear_collection_metadata', 'set_accept_ownership', 'set_collection_max_supply', 'set_price', 'buy_item'];
        Nfts: ['create', 'force_create', 'destroy', 'mint', 'force_mint', 'burn', 'transfer', 'redeposit', 'lock_item_transfer', 'unlock_item_transfer', 'lock_collection', 'transfer_ownership', 'set_team', 'force_collection_owner', 'force_collection_config', 'approve_transfer', 'cancel_approval', 'clear_all_transfer_approvals', 'lock_item_properties', 'set_attribute', 'force_set_attribute', 'clear_attribute', 'approve_item_attributes', 'cancel_item_attributes_approval', 'set_metadata', 'clear_metadata', 'set_collection_metadata', 'clear_collection_metadata', 'set_accept_ownership', 'set_collection_max_supply', 'update_mint_settings', 'set_price', 'buy_item', 'pay_tips', 'create_swap', 'cancel_swap', 'claim_swap', 'mint_pre_signed', 'set_attributes_pre_signed'];
        NftFractionalization: ['fractionalize', 'unify'];
        TransactionStorage: ['store', 'renew', 'check_proof'];
        VoterList: ['rebag', 'put_in_front_of', 'put_in_front_of_other'];
        ChildBounties: ['add_child_bounty', 'propose_curator', 'accept_curator', 'unassign_curator', 'award_child_bounty', 'claim_child_bounty', 'close_child_bounty'];
        Remark: ['store'];
        NominationPools: ['join', 'bond_extra', 'claim_payout', 'unbond', 'pool_withdraw_unbonded', 'withdraw_unbonded', 'create', 'create_with_pool_id', 'nominate', 'set_state', 'set_metadata', 'set_configs', 'update_roles', 'chill', 'bond_extra_other', 'set_claim_permission', 'claim_payout_other', 'set_commission', 'set_commission_max', 'set_commission_change_rate', 'claim_commission', 'adjust_pool_deposit', 'set_commission_claim_permission', 'apply_slash', 'migrate_delegation', 'migrate_pool_to_delegate_stake'];
        AssetConversion: ['create_pool', 'add_liquidity', 'remove_liquidity', 'swap_exact_tokens_for_tokens', 'swap_tokens_for_exact_tokens', 'touch', 'create_pool_with_fee', 'set_pool_fee'];
        FastUnstake: ['register_fast_unstake', 'deregister', 'control'];
        MessageQueue: ['reap_page', 'execute_overweight'];
        TxPause: ['pause', 'unpause'];
        SafeMode: ['enter', 'force_enter', 'extend', 'force_extend', 'force_exit', 'force_slash_deposit', 'release_deposit', 'force_release_deposit'];
        MultiBlockMigrations: ['force_set_cursor', 'force_set_active_cursor', 'force_onboard_mbms', 'clear_historic'];
        Broker: ['configure', 'reserve', 'unreserve', 'set_lease', 'start_sales', 'purchase', 'renew', 'transfer', 'partition', 'interlace', 'assign', 'pool', 'claim_revenue', 'purchase_credit', 'drop_region', 'drop_contribution', 'drop_history', 'drop_renewal', 'request_core_count', 'notify_core_count', 'notify_revenue', 'enable_auto_renew', 'disable_auto_renew', 'force_reserve', 'remove_lease', 'remove_assignment', 'remove_potential_renewal', 'force_transfer', 'swap_leases'];
        Mixnet: ['register'];
        Parameters: ['set_parameter'];
        AssetConversionMigration: ['migrate_to_new_account'];
        Revive: ['eth_transact', 'call', 'instantiate', 'instantiate_with_code', 'eth_instantiate_with_code', 'eth_call', 'eth_substrate_call', 'upload_code', 'remove_code', 'set_code', 'map_account', 'batch_map_accounts', 'unmap_account', 'dispatch_as_fallback_account'];
        Oracle: ['feed_values'];
        MetaTx: ['dispatch'];
        MultiAssetBounties: ['fund_bounty', 'fund_child_bounty', 'propose_curator', 'accept_curator', 'unassign_curator', 'award_bounty', 'close_bounty', 'check_status', 'retry_payment', 'increase_value'];
        RegistrarPara: ['reserve', 'register', 'cancel_registration', 'receive'];
        RegistrarRelay: ['authorize_code', 'apply_authorized_code', 'cancel_authorization'];
    };
    events: {
        System: ['ExtrinsicSuccess', 'ExtrinsicFailed', 'CodeUpdated', 'NewAccount', 'KilledAccount', 'Remarked', 'UpgradeAuthorized', 'RejectedInvalidAuthorizedUpgrade'];
        Utility: ['BatchInterrupted', 'BatchCompleted', 'BatchCompletedWithErrors', 'ItemCompleted', 'ItemFailed', 'DispatchedAs', 'IfElseMainSuccess', 'IfElseFallbackCalled'];
        Indices: ['IndexAssigned', 'IndexFreed', 'IndexFrozen', 'DepositPoked'];
        Balances: ['Endowed', 'DustLost', 'Transfer', 'BalanceSet', 'Reserved', 'Unreserved', 'ReserveRepatriated', 'Deposit', 'Withdraw', 'Slashed', 'Minted', 'MintedCredit', 'Burned', 'BurnedDebt', 'Suspended', 'Restored', 'Upgraded', 'Issued', 'Rescinded', 'Locked', 'Unlocked', 'Frozen', 'Thawed', 'TotalIssuanceForced', 'Held', 'BurnedHeld', 'TransferOnHold', 'TransferAndHold', 'Released', 'Unexpected'];
        TransactionPayment: ['TransactionFeePaid'];
        AssetConversionTxPayment: ['AssetTxFeePaid', 'AssetRefundFailed'];
        ElectionProviderMultiPhase: ['SolutionStored', 'ElectionFinalized', 'ElectionFailed', 'Rewarded', 'Slashed', 'PhaseTransitioned'];
        Staking: ['EraPaid', 'Rewarded', 'Slashed', 'SlashReported', 'OldSlashingReportDiscarded', 'StakersElected', 'Bonded', 'Unbonded', 'Withdrawn', 'Kicked', 'StakingElectionFailed', 'Chilled', 'PayoutStarted', 'ValidatorPrefsSet', 'SnapshotVotersSizeExceeded', 'SnapshotTargetsSizeExceeded', 'ForceEra', 'ControllerBatchDeprecated', 'CurrencyMigrated'];
        Session: ['NewSession', 'NewQueued', 'ValidatorDisabled', 'ValidatorReenabled'];
        TechnicalCommittee: ['Proposed', 'Voted', 'Approved', 'Disapproved', 'Executed', 'MemberExecuted', 'Closed', 'Killed', 'ProposalCostBurned', 'ProposalCostReleased'];
        TechnicalMembership: ['MemberAdded', 'MemberRemoved', 'MembersSwapped', 'MembersReset', 'KeyChanged', 'Dummy'];
        Grandpa: ['NewAuthorities', 'Paused', 'Resumed'];
        Treasury: ['Spending', 'Awarded', 'Burnt', 'Rollover', 'Deposit', 'SpendApproved', 'UpdatedInactive', 'AssetSpendApproved', 'AssetSpendVoided', 'Paid', 'PaymentFailed', 'SpendProcessed'];
        AssetRate: ['AssetRateCreated', 'AssetRateRemoved', 'AssetRateUpdated'];
        Contracts: ['Instantiated', 'Terminated', 'CodeStored', 'ContractEmitted', 'CodeRemoved', 'ContractCodeUpdated', 'Called', 'DelegateCalled', 'StorageDepositTransferredAndHeld', 'StorageDepositTransferredAndReleased'];
        Sudo: ['Sudid', 'KeyChanged', 'KeyRemoved', 'SudoAsDone'];
        ImOnline: ['HeartbeatReceived', 'AllGood', 'SomeOffline'];
        Offences: ['Offence'];
        Historical: ['RootStored', 'RootsPruned'];
        Identity: ['IdentitySet', 'IdentityCleared', 'IdentityKilled', 'JudgementRequested', 'JudgementUnrequested', 'JudgementGiven', 'RegistrarAdded', 'RegistrarRemoved', 'SubIdentityAdded', 'SubIdentitiesSet', 'SubIdentityRenamed', 'SubIdentityRemoved', 'SubIdentityRevoked', 'AuthorityAdded', 'AuthorityRemoved', 'UsernameSet', 'UsernameQueued', 'PreapprovalExpired', 'PrimaryUsernameSet', 'DanglingUsernameRemoved', 'UsernameUnbound', 'UsernameRemoved', 'UsernameKilled'];
        Recovery: ['AttemptApproved', 'AttemptCanceled', 'AttemptInitiated', 'AttemptFinished', 'AttemptDiscarded', 'AttemptSlashed', 'FriendGroupsChanged', 'InheritorRevoked', 'RecoveredAccountControlled'];
        Vesting: ['VestingCreated', 'VestingUpdated', 'VestingCompleted'];
        Scheduler: ['Scheduled', 'Canceled', 'Dispatched', 'RetrySet', 'RetryCancelled', 'CallUnavailable', 'PeriodicFailed', 'RetryFailed', 'PermanentlyOverweight', 'AgendaIncomplete'];
        Preimage: ['Noted', 'Requested', 'Cleared'];
        Proxy: ['ProxyExecuted', 'PureCreated', 'PureKilled', 'Announced', 'ProxyAdded', 'ProxyRemoved', 'DepositPoked'];
        Multisig: ['NewMultisig', 'MultisigApproval', 'MultisigExecuted', 'MultisigCancelled', 'DepositPoked'];
        Bounties: ['BountyProposed', 'BountyRejected', 'BountyBecameActive', 'BountyAwarded', 'BountyClaimed', 'BountyCanceled', 'BountyExtended', 'BountyApproved', 'CuratorProposed', 'CuratorUnassigned', 'CuratorAccepted', 'DepositPoked', 'BountyFundsReclaimed'];
        Assets: ['Created', 'Issued', 'Transferred', 'Burned', 'TeamChanged', 'OwnerChanged', 'Frozen', 'Thawed', 'AssetFrozen', 'AssetThawed', 'AccountsDestroyed', 'ApprovalsDestroyed', 'DestructionStarted', 'Destroyed', 'ForceCreated', 'MetadataSet', 'MetadataCleared', 'ApprovedTransfer', 'ApprovalCancelled', 'TransferredApproved', 'AssetStatusChanged', 'AssetMinBalanceChanged', 'Touched', 'Blocked', 'Deposited', 'Withdrawn', 'ReservesUpdated', 'ReservesRemoved', 'IssuedCredit', 'BurnedCredit', 'IssuedDebt', 'BurnedDebt'];
        PoolAssets: ['Created', 'Issued', 'Transferred', 'Burned', 'TeamChanged', 'OwnerChanged', 'Frozen', 'Thawed', 'AssetFrozen', 'AssetThawed', 'AccountsDestroyed', 'ApprovalsDestroyed', 'DestructionStarted', 'Destroyed', 'ForceCreated', 'MetadataSet', 'MetadataCleared', 'ApprovedTransfer', 'ApprovalCancelled', 'TransferredApproved', 'AssetStatusChanged', 'AssetMinBalanceChanged', 'Touched', 'Blocked', 'Deposited', 'Withdrawn', 'ReservesUpdated', 'ReservesRemoved', 'IssuedCredit', 'BurnedCredit', 'IssuedDebt', 'BurnedDebt'];
        Lottery: ['LotteryStarted', 'CallsUpdated', 'Winner', 'TicketBought'];
        Uniques: ['Created', 'ForceCreated', 'Destroyed', 'Issued', 'Transferred', 'Burned', 'Frozen', 'Thawed', 'CollectionFrozen', 'CollectionThawed', 'OwnerChanged', 'TeamChanged', 'ApprovedTransfer', 'ApprovalCancelled', 'ItemStatusChanged', 'CollectionMetadataSet', 'CollectionMetadataCleared', 'MetadataSet', 'MetadataCleared', 'Redeposited', 'AttributeSet', 'AttributeCleared', 'OwnershipAcceptanceChanged', 'CollectionMaxSupplySet', 'ItemPriceSet', 'ItemPriceRemoved', 'ItemBought'];
        Nfts: ['Created', 'ForceCreated', 'Destroyed', 'Issued', 'Transferred', 'Burned', 'ItemTransferLocked', 'ItemTransferUnlocked', 'ItemPropertiesLocked', 'CollectionLocked', 'OwnerChanged', 'TeamChanged', 'TransferApproved', 'ApprovalCancelled', 'AllApprovalsCancelled', 'CollectionConfigChanged', 'CollectionMetadataSet', 'CollectionMetadataCleared', 'ItemMetadataSet', 'ItemMetadataCleared', 'Redeposited', 'AttributeSet', 'AttributeCleared', 'ItemAttributesApprovalAdded', 'ItemAttributesApprovalRemoved', 'OwnershipAcceptanceChanged', 'CollectionMaxSupplySet', 'CollectionMintSettingsUpdated', 'NextCollectionIdIncremented', 'ItemPriceSet', 'ItemPriceRemoved', 'ItemBought', 'TipSent', 'SwapCreated', 'SwapCancelled', 'SwapClaimed', 'PreSignedAttributesSet', 'PalletAttributeSet'];
        NftFractionalization: ['NftFractionalized', 'NftUnified'];
        TransactionStorage: ['Stored', 'Renewed', 'ProofChecked', 'AccountAuthorized', 'AccountAuthorizationRefreshed', 'PreimageAuthorized', 'PreimageAuthorizationRefreshed', 'ExpiredAccountAuthorizationRemoved', 'ExpiredPreimageAuthorizationRemoved'];
        VoterList: ['Rebagged', 'ScoreUpdated'];
        ChildBounties: ['Added', 'Awarded', 'Claimed', 'Canceled'];
        Remark: ['Stored'];
        NominationPools: ['Created', 'Bonded', 'PaidOut', 'Unbonded', 'Withdrawn', 'Destroyed', 'StateChanged', 'MemberRemoved', 'RolesUpdated', 'PoolSlashed', 'UnbondingPoolSlashed', 'PoolCommissionUpdated', 'PoolMaxCommissionUpdated', 'PoolCommissionChangeRateUpdated', 'PoolCommissionClaimPermissionUpdated', 'PoolCommissionClaimed', 'MinBalanceDeficitAdjusted', 'MinBalanceExcessAdjusted', 'MemberClaimPermissionUpdated', 'MetadataUpdated', 'PoolNominationMade', 'PoolNominatorChilled', 'GlobalParamsUpdated'];
        AssetConversion: ['PoolCreated', 'PoolFeeSet', 'LiquidityAdded', 'LiquidityRemoved', 'SwapExecuted', 'SwapCreditExecuted', 'Touched'];
        FastUnstake: ['Unstaked', 'Slashed', 'BatchChecked', 'BatchFinished', 'InternalError'];
        MessageQueue: ['ProcessingFailed', 'Processed', 'OverweightEnqueued', 'PageReaped'];
        TxPause: ['CallPaused', 'CallUnpaused'];
        SafeMode: ['Entered', 'Extended', 'Exited', 'DepositPlaced', 'DepositReleased', 'DepositSlashed', 'CannotDeposit', 'CannotRelease'];
        Statement: ['NewStatement'];
        MultiBlockMigrations: ['UpgradeStarted', 'UpgradeCompleted', 'UpgradeFailed', 'MigrationSkipped', 'MigrationAdvanced', 'MigrationCompleted', 'MigrationFailed', 'HistoricCleared'];
        Broker: ['Purchased', 'Renewable', 'Renewed', 'Transferred', 'Partitioned', 'Interlaced', 'Assigned', 'AssignmentRemoved', 'Pooled', 'CoreCountRequested', 'CoreCountChanged', 'ReservationMade', 'ReservationCancelled', 'SaleInitialized', 'Leased', 'LeaseRemoved', 'LeaseEnding', 'SalesStarted', 'RevenueClaimBegun', 'RevenueClaimItem', 'RevenueClaimPaid', 'CreditPurchased', 'RegionDropped', 'ContributionDropped', 'RegionUnpooled', 'HistoryInitialized', 'HistoryDropped', 'HistoryIgnored', 'ClaimsReady', 'CoreAssigned', 'PotentialRenewalDropped', 'AutoRenewalEnabled', 'AutoRenewalDisabled', 'AutoRenewalFailed', 'AutoRenewalLimitReached', 'ForceReservationFailed', 'PotentialRenewalRemoved'];
        Parameters: ['Updated'];
        SkipFeelessPayment: ['FeeSkipped'];
        AssetConversionMigration: ['MigratedToNewAccount'];
        Revive: ['ContractEmitted', 'Instantiated', 'EthExtrinsicRevert'];
        DelegatedStaking: ['Delegated', 'Released', 'Slashed', 'MigratedDelegation'];
        AssetsFreezer: ['Frozen', 'Thawed'];
        Oracle: ['NewFeedData'];
        MetaTx: ['Dispatched'];
        MultiAssetBounties: ['BountyCreated', 'ChildBountyCreated', 'BountyBecameActive', 'BountyAwarded', 'BountyPayoutProcessed', 'BountyFundingProcessed', 'BountyRefundProcessed', 'BountyCanceled', 'CuratorUnassigned', 'CuratorProposed', 'PaymentFailed', 'Paid', 'BountyValueIncreased'];
        RegistrarPara: ['Reserved', 'RegisterRequested', 'Registered', 'RegistrationFailed', 'CancelRequested', 'RegistrationCancelled'];
        RegistrarRelay: ['RegistrationPending', 'RegistrationRejected', 'Registered', 'AuthorizationCancelled', 'CancellationRefused', 'ReportFailed'];
    };
    errors: {
        System: ['InvalidSpecName', 'SpecVersionNeedsToIncrease', 'FailedToExtractRuntimeVersion', 'NonDefaultComposite', 'NonZeroRefCount', 'CallFiltered', 'MultiBlockMigrationsOngoing', 'NothingAuthorized', 'Unauthorized'];
        Utility: ['TooManyCalls'];
        Babe: ['InvalidEquivocationProof', 'InvalidKeyOwnershipProof', 'DuplicateOffenceReport', 'InvalidConfiguration'];
        Indices: ['NotAssigned', 'NotOwner', 'InUse', 'NotTransfer', 'Permanent'];
        Balances: ['VestingBalance', 'LiquidityRestrictions', 'InsufficientBalance', 'ExistentialDeposit', 'Expendability', 'ExistingVestingSchedule', 'DeadAccount', 'TooManyReserves', 'TooManyHolds', 'TooManyFreezes', 'IssuanceDeactivated', 'DeltaZero'];
        ElectionProviderMultiPhase: ['PreDispatchEarlySubmission', 'PreDispatchWrongWinnerCount', 'PreDispatchWeakSubmission', 'SignedQueueFull', 'SignedCannotPayDeposit', 'SignedInvalidWitness', 'SignedTooMuchWeight', 'OcwCallWrongEra', 'MissingSnapshotMetadata', 'InvalidSubmissionIndex', 'CallNotAllowed', 'FallbackFailed', 'BoundNotMet', 'TooManyWinners', 'PreDispatchDifferentRound'];
        Staking: ['NotController', 'NotStash', 'AlreadyBonded', 'AlreadyPaired', 'EmptyTargets', 'DuplicateIndex', 'InvalidSlashIndex', 'InsufficientBond', 'NoMoreChunks', 'NoUnlockChunk', 'FundedTarget', 'InvalidEraToReward', 'InvalidNumberOfNominations', 'NotSortedAndUnique', 'AlreadyClaimed', 'InvalidPage', 'IncorrectHistoryDepth', 'IncorrectSlashingSpans', 'BadState', 'TooManyTargets', 'BadTarget', 'CannotChillOther', 'TooManyNominators', 'TooManyValidators', 'CommissionTooLow', 'BoundNotMet', 'ControllerDeprecated', 'CannotRestoreLedger', 'RewardDestinationRestricted', 'NotEnoughFunds', 'VirtualStakerNotAllowed', 'CannotReapStash', 'AlreadyMigrated', 'Restricted'];
        Session: ['InvalidProof', 'NoAssociatedValidatorId', 'DuplicatedKey', 'NoKeys', 'NoAccount'];
        TechnicalCommittee: ['NotMember', 'DuplicateProposal', 'ProposalMissing', 'WrongIndex', 'DuplicateVote', 'AlreadyInitialized', 'TooEarly', 'TooManyProposals', 'WrongProposalWeight', 'WrongProposalLength', 'PrimeAccountNotMember', 'ProposalActive'];
        TechnicalMembership: ['AlreadyMember', 'NotMember', 'TooManyMembers'];
        Grandpa: ['PauseFailed', 'ResumeFailed', 'ChangePending', 'TooSoon', 'InvalidKeyOwnershipProof', 'InvalidEquivocationProof', 'DuplicateOffenceReport'];
        Treasury: ['InvalidIndex', 'TooManyApprovals', 'InsufficientPermission', 'ProposalNotApproved', 'FailedToConvertBalance', 'SpendExpired', 'EarlyPayout', 'AlreadyAttempted', 'PayoutError', 'NotAttempted', 'Inconclusive'];
        AssetRate: ['UnknownAssetKind', 'AlreadyExists', 'Overflow'];
        Contracts: ['InvalidSchedule', 'InvalidCallFlags', 'OutOfGas', 'OutputBufferTooSmall', 'TransferFailed', 'MaxCallDepthReached', 'ContractNotFound', 'CodeTooLarge', 'CodeNotFound', 'CodeInfoNotFound', 'OutOfBounds', 'DecodingFailed', 'ContractTrapped', 'ValueTooLarge', 'TerminatedWhileReentrant', 'InputForwarded', 'RandomSubjectTooLong', 'TooManyTopics', 'NoChainExtension', 'XCMDecodeFailed', 'DuplicateContract', 'TerminatedInConstructor', 'ReentranceDenied', 'StateChangeDenied', 'StorageDepositNotEnoughFunds', 'StorageDepositLimitExhausted', 'CodeInUse', 'ContractReverted', 'CodeRejected', 'Indeterministic', 'MigrationInProgress', 'NoMigrationPerformed', 'MaxDelegateDependenciesReached', 'DelegateDependencyNotFound', 'DelegateDependencyAlreadyExists', 'CannotAddSelfAsDelegateDependency', 'OutOfTransientStorage'];
        Sudo: ['RequireSudo'];
        ImOnline: ['InvalidKey', 'DuplicatedHeartbeat'];
        Identity: ['TooManySubAccounts', 'NotFound', 'NotNamed', 'EmptyIndex', 'FeeChanged', 'NoIdentity', 'StickyJudgement', 'JudgementGiven', 'InvalidJudgement', 'InvalidIndex', 'InvalidTarget', 'TooManyRegistrars', 'AlreadyClaimed', 'NotSub', 'NotOwned', 'JudgementForDifferentIdentity', 'JudgementPaymentFailed', 'InvalidSuffix', 'NotUsernameAuthority', 'NoAllocation', 'InvalidSignature', 'RequiresSignature', 'InvalidUsername', 'UsernameTaken', 'NoUsername', 'NotExpired', 'TooEarly', 'NotUnbinding', 'AlreadyUnbinding', 'InsufficientPrivileges'];
        Recovery: ['AlreadyApproved', 'AlreadyInitiated', 'AlreadyVoted', 'HasOngoingAttempts', 'LostAccountInFriendGroup', 'HigherPriorityRecovered', 'NoCancelDelay', 'NoFriendGroups', 'NoFriends', 'NoInheritor', 'NotApproved', 'NotAttempt', 'NotCanceller', 'NotFriend', 'NotFriendGroup', 'NotInheritor', 'NotYetCancelable', 'NotYetInheritable', 'TooManyFriendGroups', 'TooManyFriendsNeeded', 'NoFriendsNeeded', 'FriendsNotSortedOrUnique', 'DuplicateFriendGroups'];
        Vesting: ['NotVesting', 'AtMaxVestingSchedules', 'AmountLow', 'ScheduleIndexOutOfBounds', 'InvalidScheduleParams'];
        Scheduler: ['FailedToSchedule', 'NotFound', 'TargetBlockNumberInPast', 'RescheduleNoChange', 'Named'];
        Preimage: ['TooBig', 'AlreadyNoted', 'NotAuthorized', 'NotNoted', 'Requested', 'NotRequested', 'TooMany', 'TooFew'];
        Proxy: ['TooMany', 'NotFound', 'NotProxy', 'Unproxyable', 'Duplicate', 'NoPermission', 'Unannounced', 'NoSelfProxy'];
        Multisig: ['MinimumThreshold', 'AlreadyApproved', 'NoApprovalsNeeded', 'TooFewSignatories', 'TooManySignatories', 'SignatoriesOutOfOrder', 'SenderInSignatories', 'NotFound', 'NotOwner', 'NoTimepoint', 'WrongTimepoint', 'UnexpectedTimepoint', 'MaxWeightTooLow', 'AlreadyStored'];
        Bounties: ['InsufficientProposersBalance', 'InvalidIndex', 'ReasonTooBig', 'UnexpectedStatus', 'RequireCurator', 'InvalidValue', 'InvalidFee', 'PendingPayout', 'Premature', 'HasActiveChildBounty', 'TooManyQueued', 'NotProposer', 'BountyStillActive'];
        Assets: ['BalanceLow', 'NoAccount', 'NoPermission', 'Unknown', 'Frozen', 'InUse', 'BadWitness', 'MinBalanceZero', 'UnavailableConsumer', 'BadMetadata', 'Unapproved', 'WouldDie', 'AlreadyExists', 'NoDeposit', 'WouldBurn', 'LiveAsset', 'AssetNotLive', 'IncorrectStatus', 'NotFrozen', 'CallbackFailed', 'BadAssetId', 'AssetIdAllocationFailed', 'ContainsFreezes', 'ContainsHolds', 'TooManyReserves', 'IncompleteDepositTransfer'];
        PoolAssets: ['BalanceLow', 'NoAccount', 'NoPermission', 'Unknown', 'Frozen', 'InUse', 'BadWitness', 'MinBalanceZero', 'UnavailableConsumer', 'BadMetadata', 'Unapproved', 'WouldDie', 'AlreadyExists', 'NoDeposit', 'WouldBurn', 'LiveAsset', 'AssetNotLive', 'IncorrectStatus', 'NotFrozen', 'CallbackFailed', 'BadAssetId', 'AssetIdAllocationFailed', 'ContainsFreezes', 'ContainsHolds', 'TooManyReserves', 'IncompleteDepositTransfer'];
        Beefy: ['InvalidKeyOwnershipProof', 'InvalidDoubleVotingProof', 'InvalidForkVotingProof', 'InvalidFutureBlockVotingProof', 'InvalidEquivocationProofSession', 'InvalidEquivocationProofSessionMember', 'DuplicateOffenceReport', 'InvalidConfiguration'];
        Lottery: ['NotConfigured', 'InProgress', 'AlreadyEnded', 'InvalidCall', 'AlreadyParticipating', 'TooManyCalls', 'EncodingFailed'];
        Uniques: ['NoPermission', 'UnknownCollection', 'AlreadyExists', 'WrongOwner', 'BadWitness', 'InUse', 'Frozen', 'WrongDelegate', 'NoDelegate', 'Unapproved', 'Unaccepted', 'Locked', 'MaxSupplyReached', 'MaxSupplyAlreadySet', 'MaxSupplyTooSmall', 'UnknownItem', 'NotForSale', 'BidTooLow', 'NoMetadata', 'WrongMetadata', 'AttributeNotFound', 'WrongAttribute'];
        Nfts: ['NoPermission', 'UnknownCollection', 'AlreadyExists', 'ApprovalExpired', 'WrongOwner', 'BadWitness', 'CollectionIdInUse', 'ItemsNonTransferable', 'NotDelegate', 'WrongDelegate', 'Unapproved', 'Unaccepted', 'ItemLocked', 'LockedItemAttributes', 'LockedCollectionAttributes', 'LockedItemMetadata', 'LockedCollectionMetadata', 'MaxSupplyReached', 'MaxSupplyLocked', 'MaxSupplyTooSmall', 'UnknownItem', 'UnknownSwap', 'MetadataNotFound', 'AttributeNotFound', 'NotForSale', 'BidTooLow', 'ReachedApprovalLimit', 'DeadlineExpired', 'WrongDuration', 'MethodDisabled', 'WrongSetting', 'InconsistentItemConfig', 'NoConfig', 'RolesNotCleared', 'MintNotStarted', 'MintEnded', 'AlreadyClaimed', 'IncorrectData', 'WrongOrigin', 'WrongSignature', 'IncorrectMetadata', 'MaxAttributesLimitReached', 'WrongNamespace', 'CollectionNotEmpty', 'WitnessRequired'];
        NftFractionalization: ['IncorrectAssetId', 'NoPermission', 'NftNotFound', 'NftNotFractionalized'];
        TransactionStorage: ['BadContext', 'BadDataSize', 'TooManyTransactions', 'NotConfigured', 'RenewedNotFound', 'UnexpectedProof', 'InvalidProof', 'MissingProof', 'MissingStateData', 'DoubleCheck', 'ProofNotChecked', 'AuthorizationNotFound', 'AuthorizationNotExpired'];
        VoterList: ['List', 'Locked'];
        ChildBounties: ['ParentBountyNotActive', 'InsufficientBountyBalance', 'TooManyChildBounties'];
        Remark: ['Empty', 'BadContext'];
        NominationPools: ['PoolNotFound', 'PoolMemberNotFound', 'RewardPoolNotFound', 'SubPoolsNotFound', 'AccountBelongsToOtherPool', 'FullyUnbonding', 'MaxUnbondingLimit', 'CannotWithdrawAny', 'MinimumBondNotMet', 'OverflowRisk', 'NotDestroying', 'NotNominator', 'NotKickerOrDestroying', 'NotOpen', 'MaxPools', 'MaxPoolMembers', 'CanNotChangeState', 'DoesNotHavePermission', 'MetadataExceedsMaxLen', 'Defensive', 'PartialUnbondNotAllowedPermissionlessly', 'MaxCommissionRestricted', 'CommissionExceedsMaximum', 'CommissionExceedsGlobalMaximum', 'CommissionChangeThrottled', 'CommissionChangeRateNotAllowed', 'NoPendingCommission', 'NoCommissionCurrentSet', 'PoolIdInUse', 'InvalidPoolId', 'BondExtraRestricted', 'NothingToAdjust', 'NothingToSlash', 'SlashTooLow', 'AlreadyMigrated', 'NotMigrated', 'NotSupported', 'Restricted'];
        AssetConversion: ['InvalidAssetPair', 'PoolExists', 'WrongDesiredAmount', 'AmountOneLessThanMinimal', 'AmountTwoLessThanMinimal', 'ReserveLeftLessThanMinimal', 'AmountOutTooHigh', 'PoolNotFound', 'Overflow', 'AssetOneDepositDidNotMeetMinimum', 'AssetTwoDepositDidNotMeetMinimum', 'AssetOneWithdrawalDidNotMeetMinimum', 'AssetTwoWithdrawalDidNotMeetMinimum', 'OptimalAmountLessThanDesired', 'InsufficientLiquidityMinted', 'ZeroLiquidity', 'ZeroAmount', 'ProvidedMinimumNotSufficientForSwap', 'ProvidedMaximumNotSufficientForSwap', 'InvalidPath', 'NonUniquePath', 'IncorrectPoolAssetId', 'BelowMinimum', 'PoolEmpty', 'FeeTooHigh'];
        FastUnstake: ['NotController', 'AlreadyQueued', 'NotFullyBonded', 'NotQueued', 'AlreadyHead', 'CallNotAllowed'];
        MessageQueue: ['NotReapable', 'NoPage', 'NoMessage', 'AlreadyProcessed', 'Queued', 'InsufficientWeight', 'TemporarilyUnprocessable', 'QueuePaused', 'RecursiveDisallowed'];
        TxPause: ['IsPaused', 'IsUnpaused', 'Unpausable', 'NotFound'];
        SafeMode: ['Entered', 'Exited', 'NotConfigured', 'NoDeposit', 'AlreadyDeposited', 'CannotReleaseYet', 'CurrencyError'];
        MultiBlockMigrations: ['Ongoing'];
        Broker: ['UnknownRegion', 'NotOwner', 'PivotTooLate', 'PivotTooEarly', 'ExteriorPivot', 'VoidPivot', 'CompletePivot', 'CorruptWorkplan', 'NoSales', 'Overpriced', 'Unavailable', 'SoldOut', 'WrongTime', 'NotAllowed', 'Uninitialized', 'TooEarly', 'NothingToDo', 'TooManyReservations', 'TooManyLeases', 'LeaseNotFound', 'UnknownRevenue', 'UnknownContribution', 'IncompleteAssignment', 'StillValid', 'NoHistory', 'UnknownReservation', 'UnknownRenewal', 'AlreadyExpired', 'InvalidConfig', 'NoClaimTimeslices', 'NoPermission', 'TooManyAutoRenewals', 'NonTaskAutoRenewal', 'SovereignAccountNotFound', 'AutoRenewalNotEnabled', 'AssignmentNotFound', 'CreditPurchaseTooSmall'];
        AssetConversionMigration: ['InvalidAssetPair', 'PoolNotFound', 'ZeroBalance', 'PartialTransfer'];
        Revive: ['InvalidSchedule', 'InvalidCallFlags', 'OutOfGas', 'TransferFailed', 'MaxCallDepthReached', 'ContractNotFound', 'CodeNotFound', 'CodeInfoNotFound', 'OutOfBounds', 'DecodingFailed', 'ContractTrapped', 'ValueTooLarge', 'TerminatedWhileReentrant', 'InputForwarded', 'TooManyTopics', 'DuplicateContract', 'TerminatedInConstructor', 'ReentranceDenied', 'ReenteredPallet', 'StateChangeDenied', 'StorageDepositNotEnoughFunds', 'StorageDepositLimitExhausted', 'CodeInUse', 'ContractReverted', 'CodeRejected', 'BlobTooLarge', 'StaticMemoryTooLarge', 'BasicBlockTooLarge', 'InvalidInstruction', 'MaxDelegateDependenciesReached', 'DelegateDependencyNotFound', 'DelegateDependencyAlreadyExists', 'CannotAddSelfAsDelegateDependency', 'OutOfTransientStorage', 'InvalidSyscall', 'InvalidStorageFlags', 'ExecutionFailed', 'BalanceConversionFailed', 'InvalidImmutableAccess', 'AccountUnmapped', 'AccountAlreadyMapped', 'InvalidGenericTransaction', 'RefcountOverOrUnderflow', 'UnsupportedPrecompileAddress', 'CallDataTooLarge', 'ReturnDataTooLarge', 'InvalidJump', 'StackUnderflow', 'StackOverflow', 'TxFeeOverdraw', 'EvmConstructorNonEmptyData', 'EvmConstructedFromHash', 'StorageRefundNotEnoughFunds', 'StorageRefundLocked', 'PrecompileDelegateDenied', 'EcdsaRecoveryFailed', 'AutoMappingEnabled', 'PendingDepositCleanup'];
        DelegatedStaking: ['NotAllowed', 'AlreadyStaking', 'InvalidRewardDestination', 'InvalidDelegation', 'NotEnoughFunds', 'NotAgent', 'NotDelegator', 'BadState', 'UnappliedSlash', 'NothingToSlash', 'WithdrawFailed', 'NotSupported'];
        AssetsFreezer: ['TooManyFreezes'];
        Oracle: ['NoPermission', 'AlreadyFeeded', 'ExceedsMaxHasDispatchedSize'];
        MetaTx: ['BadProof', 'Future', 'Stale', 'AncientBirthBlock', 'UnknownOrigin', 'Invalid', 'InvalidLength'];
        MultiAssetBounties: ['InvalidIndex', 'ReasonTooBig', 'InvalidValue', 'FailedToConvertBalance', 'UnexpectedStatus', 'RequireCurator', 'InsufficientPermission', 'FundingError', 'RefundError', 'PayoutError', 'FundingInconclusive', 'RefundInconclusive', 'PayoutInconclusive', 'FailedToConvertSource', 'HasActiveChildBounty', 'TooManyChildBounties', 'InsufficientBountyValue', 'PreimageNotExist'];
        AssetsPrecompilesPermit: ['InvalidSignature', 'SignerMismatch', 'PermitExpired', 'SignatureSValueTooHigh', 'InvalidVValue', 'NonceOverflow', 'InvalidOwner', 'InvalidSpender'];
        RegistrarPara: ['NotReserved', 'NotOwner', 'AlreadyRegistered', 'NotPending', 'CannotCancelYet', 'HeadDataTooLarge', 'CodeTooLarge', 'CodeTooSmall', 'SendFailed', 'NoFreeParaId'];
        RegistrarRelay: ['NothingPending', 'CodeHashMismatch', 'CodeLenMismatch', 'CodeTooLarge', 'UnexpectedMessage'];
    };
    constants: {
        System: ['BlockWeights', 'BlockLength', 'BlockHashCount', 'DbWeight', 'Version', 'SS58Prefix'];
        Utility: ['batched_calls_limit'];
        Babe: ['EpochDuration', 'ExpectedBlockTime', 'MaxAuthorities', 'MaxNominators'];
        Timestamp: ['MinimumPeriod'];
        Indices: ['Deposit'];
        Balances: ['ExistentialDeposit', 'MaxLocks', 'MaxReserves', 'MaxFreezes'];
        TransactionPayment: ['OperationalFeeMultiplier'];
        ElectionProviderMultiPhase: ['BetterSignedThreshold', 'OffchainRepeat', 'MinerTxPriority', 'SignedMaxSubmissions', 'SignedMaxWeight', 'SignedMaxRefunds', 'SignedRewardBase', 'SignedDepositByte', 'SignedDepositWeight', 'MaxWinners', 'MaxBackersPerWinner', 'MinerMaxLength', 'MinerMaxWeight', 'MinerMaxVotesPerVoter', 'MinerMaxWinners'];
        Staking: ['HistoryDepth', 'SessionsPerEra', 'BondingDuration', 'SlashDeferDuration', 'MaxExposurePageSize', 'MaxValidatorSet', 'MaxUnlockingChunks'];
        Session: ['KeyDeposit'];
        TechnicalCommittee: ['MaxProposalWeight'];
        Grandpa: ['MaxAuthorities', 'MaxNominators', 'MaxSetIdSessionEntries'];
        Treasury: ['SpendPeriod', 'Burn', 'PalletId', 'MaxApprovals', 'PayoutPeriod', 'pot_account'];
        Contracts: ['Schedule', 'DepositPerByte', 'DefaultDepositLimit', 'DepositPerItem', 'CodeHashLockupDepositPercent', 'MaxCodeLen', 'MaxStorageKeyLen', 'MaxTransientStorageSize', 'MaxDelegateDependencies', 'UnsafeUnstableInterface', 'MaxDebugBufferLen', 'Environment', 'ApiVersion'];
        ImOnline: ['UnsignedPriority'];
        Identity: ['BasicDeposit', 'ByteDeposit', 'UsernameDeposit', 'SubAccountDeposit', 'MaxSubAccounts', 'MaxRegistrars', 'PendingUsernameExpiration', 'UsernameGracePeriod', 'MaxSuffixLength', 'MaxUsernameLength'];
        Recovery: ['SecurityDeposit', 'MaxFriendsPerConfig'];
        Vesting: ['MinVestedTransfer', 'MaxVestingSchedules'];
        Scheduler: ['MaximumWeight', 'MaxScheduledPerBlock'];
        Proxy: ['ProxyDepositBase', 'ProxyDepositFactor', 'MaxProxies', 'MaxPending', 'AnnouncementDepositBase', 'AnnouncementDepositFactor'];
        Multisig: ['DepositBase', 'DepositFactor', 'MaxSignatories'];
        Bounties: ['BountyDepositBase', 'BountyDepositPayoutDelay', 'BountyUpdatePeriod', 'CuratorDepositMultiplier', 'CuratorDepositMax', 'CuratorDepositMin', 'BountyValueMinimum', 'DataDepositPerByte', 'MaximumReasonLength'];
        Assets: ['RemoveItemsLimit', 'AssetDeposit', 'AssetAccountDeposit', 'MetadataDepositBase', 'MetadataDepositPerByte', 'ApprovalDeposit', 'StringLimit'];
        PoolAssets: ['RemoveItemsLimit', 'AssetDeposit', 'AssetAccountDeposit', 'MetadataDepositBase', 'MetadataDepositPerByte', 'ApprovalDeposit', 'StringLimit'];
        Beefy: ['MaxAuthorities', 'MaxNominators', 'MaxSetIdSessionEntries'];
        Lottery: ['PalletId', 'MaxCalls', 'MaxGenerateRandom'];
        Uniques: ['CollectionDeposit', 'ItemDeposit', 'MetadataDepositBase', 'AttributeDepositBase', 'DepositPerByte', 'StringLimit', 'KeyLimit', 'ValueLimit'];
        Nfts: ['CollectionDeposit', 'ItemDeposit', 'MetadataDepositBase', 'AttributeDepositBase', 'DepositPerByte', 'StringLimit', 'KeyLimit', 'ValueLimit', 'ApprovalsLimit', 'ItemAttributesApprovalsLimit', 'MaxTips', 'MaxDeadlineDuration', 'MaxAttributesPerCall', 'Features'];
        NftFractionalization: ['Deposit', 'PalletId', 'NewAssetSymbol', 'NewAssetName', 'StringLimit'];
        TransactionStorage: ['MaxBlockTransactions', 'MaxTransactionSize'];
        VoterList: ['BagThresholds', 'MaxAutoRebagPerBlock'];
        ChildBounties: ['MaxActiveChildBountyCount', 'ChildBountyValueMinimum'];
        NominationPools: ['PalletId', 'MaxPointsToBalance', 'MaxUnbonding', 'MaxUnbondingPools'];
        AssetConversion: ['LPFee', 'MaxSwapFee', 'PoolSetupFee', 'PoolSetupFeeAsset', 'LiquidityWithdrawalFee', 'MintMinLiquidity', 'MaxSwapPathLength', 'PalletId'];
        FastUnstake: ['Deposit'];
        MessageQueue: ['HeapSize', 'MaxStale', 'ServiceWeight', 'IdleMaxServiceWeight'];
        TxPause: ['MaxNameLen'];
        SafeMode: ['EnterDuration', 'ExtendDuration', 'EnterDepositAmount', 'ExtendDepositAmount', 'ReleaseDelay'];
        Statement: ['StatementCost', 'ByteCost', 'MinAllowedStatements', 'MaxAllowedStatements', 'MinAllowedBytes', 'MaxAllowedBytes'];
        MultiBlockMigrations: ['CursorMaxLen', 'IdentifierMaxLen'];
        Broker: ['PalletId', 'TimeslicePeriod', 'MaxLeasedCores', 'MaxReservedCores', 'MaxAutoRenewals', 'MinimumCreditPurchase'];
        Mixnet: ['MaxAuthorities', 'MaxExternalAddressSize', 'MaxExternalAddressesPerMixnode', 'NumCoverToCurrentBlocks', 'NumRequestsToCurrentBlocks', 'NumCoverToPrevBlocks', 'NumRegisterStartSlackBlocks', 'NumRegisterEndSlackBlocks', 'RegistrationPriority', 'MinMixnodes'];
        Revive: ['DepositPerByte', 'DepositPerItem', 'DepositPerChildTrieItem', 'CodeHashLockupDepositPercent', 'AllowEVMBytecode', 'ChainId', 'NativeToEthRatio', 'MaxEthExtrinsicWeight', 'DebugEnabled', 'AutoMap', 'GasScale'];
        DelegatedStaking: ['PalletId', 'SlashRewardFraction'];
        Oracle: ['PalletId', 'MaxHasDispatchedSize', 'MaxFeedValues'];
        MultiAssetBounties: ['BountyValueMinimum', 'ChildBountyValueMinimum', 'MaxActiveChildBountyCount'];
        AssetsPrecompilesPermit: ['ChainId'];
        RegistrarPara: ['FirstPublicParaId', 'MinCodeSize', 'MaxCodeSize', 'MaxHeadDataSize', 'PendingDeadline'];
        RegistrarRelay: ['MaxHeadDataSize', 'MaxCodeSize', 'MaxPendingRegistrations', 'UnsignedPriority'];
    };
    viewFns: {
        Recovery: ['provided_block_number', 'friend_groups', 'attempts', 'inheritor', 'inheritance'];
        Proxy: ['check_permissions', 'is_superset'];
        Assets: ['asset_details', 'balance_of', 'get_metadata', 'get_reserves_data'];
        PoolAssets: ['asset_details', 'balance_of', 'get_metadata', 'get_reserves_data'];
        VoterList: ['scores'];
        AssetConversion: ['get_reserves', 'quote_price_exact_tokens_for_tokens', 'quote_price_tokens_for_exact_tokens'];
        MultiBlockMigrations: ['ongoing_status', 'progress', 'affected_prefixes', 'status'];
        Oracle: ['get_value', 'all_values'];
    };
    apis: {
        Core: ['version', 'execute_block', 'initialize_block'];
        Metadata: ['metadata', 'metadata_at_version', 'metadata_versions'];
        RuntimeViewFunction: ['execute_view_function'];
        BlockBuilder: ['apply_extrinsic', 'finalize_block', 'inherent_extrinsics', 'check_inherents'];
        TaggedTransactionQueue: ['validate_transaction'];
        OffchainWorkerApi: ['offchain_worker'];
        GrandpaApi: ['grandpa_authorities', 'submit_report_equivocation_unsigned_extrinsic', 'generate_key_ownership_proof', 'current_set_id'];
        NominationPoolsApi: ['pending_rewards', 'points_to_balance', 'balance_to_points', 'pool_pending_slash', 'member_pending_slash', 'pool_needs_delegate_migration', 'member_needs_delegate_migration', 'member_total_balance', 'pool_balance', 'pool_accounts'];
        StakingApi: ['nominations_quota', 'eras_stakers_page_count', 'pending_rewards'];
        BabeApi: ['configuration', 'current_epoch_start', 'current_epoch', 'next_epoch', 'generate_key_ownership_proof', 'submit_report_equivocation_unsigned_extrinsic'];
        AuthorityDiscoveryApi: ['authorities'];
        OracleApi: ['get_value', 'get_all_values'];
        AccountNonceApi: ['account_nonce'];
        AssetsApi: ['account_balances'];
        ContractsApi: ['call', 'instantiate', 'upload_code', 'get_storage'];
        TransactionPaymentApi: ['query_info', 'query_fee_details', 'query_weight_to_fee', 'query_length_to_fee'];
        AssetConversionApi: ['quote_price_tokens_for_exact_tokens', 'quote_price_exact_tokens_for_tokens', 'get_reserves'];
        TransactionPaymentCallApi: ['query_call_info', 'query_call_fee_details', 'query_weight_to_fee', 'query_length_to_fee'];
        NftsApi: ['owner', 'collection_owner', 'attribute', 'custom_attribute', 'system_attribute', 'collection_attribute'];
        BeefyApi: ['beefy_genesis', 'validator_set', 'submit_report_double_voting_unsigned_extrinsic', 'submit_report_fork_voting_unsigned_extrinsic', 'submit_report_future_block_voting_unsigned_extrinsic', 'generate_key_ownership_proof'];
        MmrApi: ['mmr_root', 'mmr_leaf_count', 'generate_proof', 'generate_ancestry_proof', 'verify_proof', 'verify_proof_stateless'];
        MixnetApi: ['session_status', 'prev_mixnodes', 'current_mixnodes', 'maybe_register'];
        SessionKeys: ['generate_session_keys', 'decode_session_keys'];
        TransactionStorageApi: ['retention_period', 'indexed_transactions'];
        GenesisBuilder: ['build_state', 'get_preset', 'preset_names'];
        ReviveApi: ['eth_block', 'eth_block_hash', 'eth_receipt_data', 'block_gas_limit', 'max_extrinsic_weight_in_gas', 'balance', 'gas_price', 'nonce', 'call', 'instantiate', 'eth_transact', 'eth_transact_with_config', 'eth_estimate_gas', 'eth_pre_dispatch_weight', 'upload_code', 'get_storage', 'get_storage_var_key', 'trace_block', 'trace_tx', 'trace_call', 'trace_call_with_config', 'block_author', 'address', 'account_id', 'runtime_pallets_address', 'code', 'new_balance_with_dust', 'version_declarations', 'eth_block_versioned', 'eth_block_hash_versioned', 'eth_receipt_data_versioned', 'block_gas_limit_versioned', 'max_extrinsic_weight_in_gas_versioned', 'balance_versioned', 'gas_price_versioned', 'nonce_versioned', 'call_versioned', 'instantiate_versioned', 'eth_transact_versioned', 'eth_estimate_gas_versioned', 'eth_pre_dispatch_weight_versioned', 'upload_code_versioned', 'get_storage_versioned', 'runtime_pallets_address_versioned', 'code_versioned', 'account_id_versioned', 'new_balance_with_dust_versioned', 'block_author_versioned', 'address_versioned', 'trace_block_versioned', 'trace_tx_versioned', 'trace_call_versioned'];
    };
};
export type PortaldotWhitelistEntry = PalletKey | `query.${NestedKey<AllInteractions['storage']>}` | `tx.${NestedKey<AllInteractions['tx']>}` | `event.${NestedKey<AllInteractions['events']>}` | `error.${NestedKey<AllInteractions['errors']>}` | `const.${NestedKey<AllInteractions['constants']>}` | `view.${NestedKey<AllInteractions['viewFns']>}` | `api.${NestedKey<AllInteractions['apis']>}`;
type PalletKey = `*.${({
    [K in keyof AllInteractions]: K extends 'apis' ? never : keyof AllInteractions[K];
})[keyof AllInteractions]}`;
type NestedKey<D extends Record<string, string[]>> = "*" | {
    [P in keyof D & string]: `${P}.*` | `${P}.${D[P][number]}`;
}[keyof D & string];
